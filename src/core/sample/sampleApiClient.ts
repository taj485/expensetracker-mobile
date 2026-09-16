import { ApiError, type ApiClient, type DownloadedFile } from '@/core/api/apiClient';
import type { CreateExpenseTableCommand } from '@/core/models/expense-table.model';
import type { AddExpenseCommand, Expense } from '@/core/models/expense.model';

import { createSampleStore, SAMPLE_USER, SAMPLE_USER_ID, sampleExtraction } from './sampleData';
import { sampleFile } from './sampleFile';

// SAMPLE-DATA — in-memory stand-in for ExpenseTrackerAPI, used when env.useSampleData is on.
// Implements only the routes the app calls today; anything else fails loudly so a missing
// route is obvious. Data resets when the app reloads.

const store = createSampleStore();

/** Enough delay to see loading states, short enough not to get in the way. */
const LATENCY_MS = 350;

const wait = () => new Promise(resolve => setTimeout(resolve, LATENCY_MS));

/** Copies like a JSON response would, so screens can't mutate the store (Hermes lacks structuredClone). */
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function notFound(method: string, path: string): never {
  throw new ApiError(404, `Sample data: no handler for ${method} ${path}`);
}

function spaceExpenses(spaceId: number) {
  const expenses = store.expensesBySpace.get(spaceId);
  if (!expenses) throw new ApiError(404, `Sample data: space ${spaceId} not found`);
  return expenses;
}

async function handle(method: string, path: string, body?: unknown): Promise<unknown> {
  await wait();
  const segments = path.split('/').filter(Boolean); // e.g. ['expensetable', '1', 'expenses', '1004']
  if (segments[0] !== 'expensetable') notFound(method, path);

  const spaceId = segments[1] != null ? Number(segments[1]) : null;
  const expenseId = segments[3] != null && /^\d+$/.test(segments[3]) ? Number(segments[3]) : null;

  // /expensetable
  if (spaceId == null) {
    if (method === 'GET') return clone(store.spaces);
    if (method === 'POST') {
      const { name } = body as CreateExpenseTableCommand;
      const id = store.nextSpaceId++;
      store.spaces.push({
        id,
        name,
        dateCreated: new Date().toISOString(),
        isCurrentUserAdmin: true,
        isStarred: store.spaces.length === 0,
        memberCount: 1,
      });
      store.expensesBySpace.set(id, []);
      store.membersBySpace.set(id, [{ userId: SAMPLE_USER_ID, email: SAMPLE_USER.email, isAdmin: true }]);
      return { id };
    }
  }

  // DELETE /expensetable/{id}
  if (method === 'DELETE' && spaceId != null && segments.length === 2) {
    // Same rule as the API's DeleteExpenseTableCommandHandler: admins only (403 otherwise).
    if (!store.spaces.find(s => s.id === spaceId)?.isCurrentUserAdmin) {
      throw new ApiError(403, JSON.stringify({ error: 'Only an admin can delete this expense table' }));
    }
    store.spaces = store.spaces.filter(s => s.id !== spaceId);
    store.expensesBySpace.delete(spaceId);
    store.membersBySpace.delete(spaceId);
    return undefined;
  }

  // /expensetable/{id}/members
  if (segments[2] === 'members' && spaceId != null) {
    const members = store.membersBySpace.get(spaceId);
    if (!members) throw new ApiError(404, `Sample data: space ${spaceId} not found`);

    if (method === 'GET') {
      // Same shape and order as the API: admins first, then by email.
      return members
        .map(m => ({ ...m, isCurrentUser: m.userId === SAMPLE_USER_ID }))
        .sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin) || (a.email ?? '').localeCompare(b.email ?? ''));
    }

    if (method === 'POST') {
      const { inviteeEmail, isAdmin } = body as { inviteeEmail: string; isAdmin: boolean };
      const email = inviteeEmail.trim().toLowerCase();
      // Mirrors the API's rule that only existing users can be invited.
      if (!email.endsWith('@example.com')) {
        throw new ApiError(400, JSON.stringify({ error: `No Recave user found with email ${inviteeEmail}.` }));
      }
      if (members.some(m => m.email === email)) {
        throw new ApiError(400, JSON.stringify({ error: 'User is already a member of this expense table' }));
      }
      members.push({ userId: store.nextUserId++, email, isAdmin });
      const space = store.spaces.find(s => s.id === spaceId);
      if (space) space.memberCount = members.length;
      return undefined;
    }
  }

  // /expensetable/{id}/star
  if (segments[2] === 'star' && spaceId != null) {
    if (method === 'POST') {
      store.spaces.forEach(space => (space.isStarred = space.id === spaceId));
      return undefined;
    }
    if (method === 'DELETE') {
      const space = store.spaces.find(s => s.id === spaceId);
      if (space) space.isStarred = false;
      return undefined;
    }
  }

  // /expensetable/{id}/expenses[/{expenseId} | /extract-receipt | /receipt-image | /batch]
  if (segments[2] === 'expenses' && spaceId != null) {
    const expenses = spaceExpenses(spaceId);
    const action = segments[3];

    if (method === 'POST' && action === 'extract-receipt') {
      // Reading a receipt takes a moment for real; make the progress state visible.
      await new Promise(resolve => setTimeout(resolve, 1200));
      return sampleExtraction();
    }
    if (method === 'POST' && action === 'receipt-image') {
      return { imageReference: `sample/receipt-${Date.now()}.jpg` };
    }
    if (method === 'POST' && action === 'batch') {
      const { items } = body as { items: AddExpenseCommand[] };
      const receiptId = store.nextReceiptId++;
      const added = items.map(item => ({
        id: store.nextExpenseId++,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        currency: 'GBP',
        description: item.description,
        category: item.category,
        date: item.date,
        merchantId: null,
        merchant: item.merchant,
        merchantWebsite: null,
        receiptId: items.length > 1 ? receiptId : null,
        // Like the API, the uploader is whoever made the request.
        createdByEmail: SAMPLE_USER.email,
        createdByCurrentUser: true,
      }));
      expenses.unshift(...added);
      return { addedIds: added.map(e => e.id), errors: [] };
    }

    if (expenseId == null && action == null && method === 'POST') {
      const item = body as AddExpenseCommand;
      const id = store.nextExpenseId++;
      expenses.unshift({
        id,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        currency: 'GBP',
        description: item.description,
        category: item.category,
        date: item.date,
        merchantId: null,
        merchant: item.merchant,
        merchantWebsite: null,
        receiptId: null,
        createdByEmail: SAMPLE_USER.email,
        createdByCurrentUser: true,
      });
      return { id };
    }

    if (expenseId == null && method === 'GET') return clone(expenses);

    if (expenseId != null) {
      const index = expenses.findIndex(e => e.id === expenseId);
      if (index === -1) throw new ApiError(404, `Sample data: expense ${expenseId} not found`);
      if (method === 'GET') return clone(expenses[index]);
      if (method === 'PUT') {
        const update = body as { unitPrice: number; quantity: number; category: Expense['category']; description: string; merchant: string | null };
        const current = expenses[index];
        const merchantChanged = current.merchant !== update.merchant;
        // Like the API: date is untouched, and a new merchant name loses the old merchant's website.
        expenses[index] = {
          ...current,
          ...update,
          merchantWebsite: merchantChanged ? null : current.merchantWebsite,
        };
        return undefined;
      }
      if (method === 'DELETE') {
        expenses.splice(index, 1);
        return undefined;
      }
    }
  }

  notFound(method, path);
}

export const sampleApiClient: ApiClient = {
  get: path => handle('GET', path) as never,
  post: (path, body) => handle('POST', path, body) as never,
  put: (path, body) => handle('PUT', path, body) as never,
  delete: path => handle('DELETE', path) as never,
  // The photo itself is ignored — sample extraction always "reads" the same receipt.
  postForm: path => handle('POST', path) as never,
  download: async path => {
    await wait();
    // /expensetable/{id}/expenses/by-receipt/{receiptId}/image
    const match = /^\/expensetable\/(\d+)\/expenses\/by-receipt\/(\d+)\/image$/.exec(path);
    if (!match) notFound('GET', path);
    const receiptId = Number(match[2]);
    const lines = spaceExpenses(Number(match[1])).filter(e => e.receiptId === receiptId);
    if (lines.length === 0) throw new ApiError(404, JSON.stringify({ error: `Receipt with id ${receiptId} was not found` }));
    return sampleReceiptImage(receiptId, lines);
  },
};

/** No photos exist in sample mode, so draw a simple receipt image from the line items instead. */
function sampleReceiptImage(receiptId: number, lines: Expense[]): DownloadedFile {
  const escape = (text: string) => text.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
  const rows = lines
    .map((e, i) => {
      const y = 110 + i * 28;
      return `<text x="20" y="${y}">${escape(e.description)}</text><text x="340" y="${y}" text-anchor="end">£${(e.unitPrice * e.quantity).toFixed(2)}</text>`;
    })
    .join('');
  const height = 170 + lines.length * 28;
  const total = lines.reduce((sum, e) => sum + e.unitPrice * e.quantity, 0);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="${height}" font-family="monospace" font-size="14">
<rect width="100%" height="100%" fill="#fff"/>
<text x="180" y="40" text-anchor="middle" font-size="20" font-weight="bold">${escape(lines[0].merchant ?? 'Receipt')}</text>
<text x="180" y="66" text-anchor="middle" fill="#666">${lines[0].date.slice(0, 10)} · sample receipt</text>
${rows}
<text x="20" y="${height - 30}" font-weight="bold">TOTAL</text><text x="340" y="${height - 30}" text-anchor="end" font-weight="bold">£${total.toFixed(2)}</text>
</svg>`;
  return sampleFile(svg, `receipt-${receiptId}.svg`, 'image/svg+xml');
}

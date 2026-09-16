import type { ExpenseTable, ExpenseTableMember } from '@/core/models/expense-table.model';
import type { Expense, ExpenseCategory, ExtractedExpense } from '@/core/models/expense.model';

// SAMPLE-DATA — fake spaces and expenses for the dev-only sample mode (env.useSampleData).
// Dates are relative to today so the current month always has spending to show.

export const SAMPLE_USER = {
  sub: 'sample|user',
  name: 'James Carter',
  givenName: 'James',
  email: 'james@example.com',
};

interface LineItem {
  description: string;
  category: ExpenseCategory;
  unitPrice: number;
  quantity?: number;
}

interface SampleReceipt {
  merchant: string | null;
  website: string | null;
  /** Days before today. */
  daysAgo: number;
  items: LineItem[];
}

const HOUSEHOLD: SampleReceipt[] = [
  {
    merchant: 'Tesco',
    website: 'tesco.com',
    daysAgo: 1,
    items: [
      { description: 'Large Broccoli 500g', category: 'Food', unitPrice: 0.89, quantity: 2 },
      { description: 'Semi Skimmed Milk 4pt', category: 'Food', unitPrice: 1.65, quantity: 2 },
      { description: 'Finest Rose & Lily Bouquet', category: 'Entertainment', unitPrice: 18 },
      { description: 'Sourdough Loaf', category: 'Food', unitPrice: 2.2 },
    ],
  },
  {
    merchant: 'Boots',
    website: 'boots.com',
    daysAgo: 2,
    items: [
      { description: 'Acuvue Oasys 6pk', category: 'Health', unitPrice: 17.99, quantity: 2 },
      { description: 'Ibuprofen 200mg 16pk', category: 'Health', unitPrice: 2.49 },
    ],
  },
  {
    merchant: 'Transport for London',
    website: 'tfl.gov.uk',
    daysAgo: 3,
    items: [{ description: 'Oyster top-up', category: 'Transport', unitPrice: 30 }],
  },
  {
    merchant: 'Octopus Energy',
    website: 'octopus.energy',
    daysAgo: 4,
    items: [{ description: 'Monthly energy bill', category: 'Utilities', unitPrice: 88.4 }],
  },
  {
    merchant: "Sainsbury's",
    website: 'sainsburys.co.uk',
    daysAgo: 6,
    items: [
      { description: 'Chicken Breast Fillets 650g', category: 'Food', unitPrice: 5.25 },
      { description: 'Basmati Rice 1kg', category: 'Food', unitPrice: 2.1 },
      { description: 'Greek Yoghurt 500g', category: 'Food', unitPrice: 1.85, quantity: 2 },
    ],
  },
  {
    merchant: 'Netflix',
    website: 'netflix.com',
    daysAgo: 8,
    items: [{ description: 'Standard plan', category: 'Entertainment', unitPrice: 12.99 }],
  },
  {
    merchant: null,
    website: null,
    daysAgo: 9,
    items: [{ description: 'Window cleaner', category: 'Utilities', unitPrice: 15 }],
  },
  {
    merchant: 'Pret A Manger',
    website: 'pret.com',
    daysAgo: 12,
    items: [
      { description: 'Flat White', category: 'Food', unitPrice: 3.45 },
      { description: 'Chicken & Avocado Sandwich', category: 'Food', unitPrice: 5.99 },
    ],
  },
  {
    merchant: 'Thames Water',
    website: 'thameswater.co.uk',
    daysAgo: 35,
    items: [{ description: 'Water bill', category: 'Utilities', unitPrice: 42.6 }],
  },
  {
    merchant: 'Tesco',
    website: 'tesco.com',
    daysAgo: 38,
    items: [
      { description: 'Free Range Eggs 12pk', category: 'Food', unitPrice: 3.1 },
      { description: 'Bananas 5pk', category: 'Food', unitPrice: 0.85 },
      { description: 'Washing Up Liquid', category: 'Utilities', unitPrice: 1.5 },
    ],
  },
  {
    merchant: 'Odeon',
    website: 'odeon.co.uk',
    daysAgo: 41,
    items: [{ description: 'Cinema tickets', category: 'Entertainment', unitPrice: 13.5, quantity: 2 }],
  },
  {
    merchant: 'Shell',
    website: 'shell.co.uk',
    daysAgo: 45,
    items: [{ description: 'Unleaded fuel', category: 'Transport', unitPrice: 62.3 }],
  },
  {
    merchant: 'Octopus Energy',
    website: 'octopus.energy',
    daysAgo: 64,
    items: [{ description: 'Monthly energy bill', category: 'Utilities', unitPrice: 92.1 }],
  },
  {
    merchant: 'Waitrose',
    website: 'waitrose.com',
    daysAgo: 70,
    items: [
      { description: 'Salmon Fillets 240g', category: 'Food', unitPrice: 6.5 },
      { description: 'Asparagus Tips', category: 'Food', unitPrice: 2.75 },
    ],
  },
];

const TRAVEL: SampleReceipt[] = [
  {
    merchant: 'Trainline',
    website: 'thetrainline.com',
    daysAgo: 5,
    items: [{ description: 'London → Edinburgh return', category: 'Transport', unitPrice: 89.5 }],
  },
  {
    merchant: 'Premier Inn',
    website: 'premierinn.com',
    daysAgo: 5,
    items: [{ description: 'Edinburgh City Centre, 2 nights', category: 'Entertainment', unitPrice: 74, quantity: 2 }],
  },
  {
    merchant: 'Pret A Manger',
    website: 'pret.com',
    daysAgo: 4,
    items: [{ description: 'Breakfast wrap & coffee', category: 'Food', unitPrice: 7.2 }],
  },
];

const WORK: SampleReceipt[] = [
  {
    merchant: 'Amazon',
    website: 'amazon.co.uk',
    daysAgo: 10,
    items: [
      { description: 'USB-C Hub', category: 'Utilities', unitPrice: 29.99 },
      { description: 'Notebook A5 3pk', category: 'Utilities', unitPrice: 8.49 },
    ],
  },
];

function isoDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
}

let nextExpenseId = 1000;
let nextReceiptId = 500;

/**
 * @param uploaders Emails of the members who add receipts, rotated across the receipts so a
 * shared space shows a mix of "Added by you" and other people.
 */
function toExpenses(receipts: SampleReceipt[], uploaders: string[]): Expense[] {
  return receipts.flatMap((receipt, receiptIndex) => {
    // Multi-item receipts share a receipt id so they group into one card, like scanned receipts.
    const receiptId = receipt.items.length > 1 ? nextReceiptId++ : null;
    const uploader = uploaders[receiptIndex % uploaders.length];
    return receipt.items.map(item => ({
      id: nextExpenseId++,
      unitPrice: item.unitPrice,
      quantity: item.quantity ?? 1,
      currency: 'GBP',
      description: item.description,
      category: item.category,
      date: isoDaysAgo(receipt.daysAgo),
      merchantId: null,
      merchant: receipt.merchant,
      merchantWebsite: receipt.website,
      receiptId,
      createdByEmail: uploader,
      createdByCurrentUser: uploader === SAMPLE_USER.email,
    }));
  });
}

/** What the sample "AI" reads off any photo: a small supermarket shop dated today. */
export function sampleExtraction(): ExtractedExpense[] {
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const base = { merchant: 'Tesco Express', merchantWebsite: 'tesco.com', date };
  return [
    { ...base, description: 'Semi Skimmed Milk 2pt', category: 'Food', unitPrice: 1.45, quantity: 1 },
    { ...base, description: 'Hovis Wholemeal Bread', category: 'Food', unitPrice: 1.6, quantity: 1 },
    { ...base, description: 'Colgate Toothpaste 75ml', category: 'Health', unitPrice: 2.25, quantity: 2 },
  ];
}

export interface SampleStore {
  spaces: ExpenseTable[];
  expensesBySpace: Map<number, Expense[]>;
  /** Stored without isCurrentUser — the client derives it from SAMPLE_USER_ID, as the API does. */
  membersBySpace: Map<number, Omit<ExpenseTableMember, 'isCurrentUser'>[]>;
  nextSpaceId: number;
  nextExpenseId: number;
  nextReceiptId: number;
  nextUserId: number;
}

/** The sample user's id in membership lists. */
export const SAMPLE_USER_ID = 1;

export function createSampleStore(): SampleStore {
  const dateCreated = isoDaysAgo(120);
  const me = { userId: SAMPLE_USER_ID, email: SAMPLE_USER.email, isAdmin: true };
  return {
    spaces: [
      { id: 1, name: 'Household expenses', dateCreated, isCurrentUserAdmin: true, isStarred: true, memberCount: 2 },
      { id: 2, name: 'Edinburgh trip', dateCreated, isCurrentUserAdmin: true, isStarred: false, memberCount: 3 },
      { id: 3, name: 'Work', dateCreated, isCurrentUserAdmin: false, isStarred: false, memberCount: 2 },
    ],
    expensesBySpace: new Map([
      // Uploaders match each space's members below.
      [1, toExpenses(HOUSEHOLD, [SAMPLE_USER.email, 'emma.carter@example.com'])],
      [2, toExpenses(TRAVEL, [SAMPLE_USER.email, 'alex.morgan@example.com', 'priya.shah@example.com'])],
      [3, toExpenses(WORK, ['finance@example.com', SAMPLE_USER.email])],
    ]),
    membersBySpace: new Map([
      [1, [me, { userId: 2, email: 'emma.carter@example.com', isAdmin: false }]],
      [
        2,
        [
          me,
          { userId: 3, email: 'alex.morgan@example.com', isAdmin: true },
          { userId: 4, email: 'priya.shah@example.com', isAdmin: false },
        ],
      ],
      [3, [{ userId: 5, email: 'finance@example.com', isAdmin: true }, { ...me, isAdmin: false }]],
    ]),
    nextSpaceId: 4,
    nextExpenseId: 5000,
    nextReceiptId: 900,
    nextUserId: 100,
  };
}

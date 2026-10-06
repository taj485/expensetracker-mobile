// Ported from the web client (core/utils/date.utils.ts). Local date fields throughout — an
// expense dated the 1st at 00:30 UTC belongs to the month the user saw on the form.

const LOCALE = 'en-GB';

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function todayLocalISODate(): string {
  const d = new Date();
  return `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Current month as 'YYYY-MM'. */
export function currentMonthKey(): string {
  return monthKey(new Date());
}

/** The 'YYYY-MM' an expense date falls in. */
export function monthKeyOf(isoDate: string): string {
  return monthKey(new Date(isoDate));
}

/** The local 'YYYY-MM-DD' an expense date falls on. */
export function dayKeyOf(isoDate: string): string {
  const d = new Date(isoDate);
  return `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The month before a 'YYYY-MM' key. */
export function previousMonthKey(key: string): string {
  const [year, month] = key.split('-').map(Number);
  // Day 1 avoids the month-end rollover trap.
  return monthKey(new Date(year, month - 2, 1));
}

/** The current month plus the given number of preceding months, newest first. */
export function monthKeysBack(monthsBack: number): string[] {
  const now = new Date();
  return Array.from({ length: monthsBack + 1 }, (_, i) =>
    monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)),
  );
}

/** Days in a 'YYYY-MM' month that have already started (today counts for the current month). */
export function elapsedDaysInMonth(key: string): number {
  const [year, month] = key.split('-').map(Number);
  if (key === currentMonthKey()) return new Date().getDate();
  return new Date(year, month, 0).getDate();
}

/** '2026-08' → 'August 2026'. */
export function formatMonthKey(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(LOCALE, { month: 'long', year: 'numeric' });
}

/** '2026-08' → 'Aug 2026'. */
export function formatMonthKeyShort(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(LOCALE, { month: 'short', year: 'numeric' });
}

/** '04/09/26' — matches the web receipt cards. */
export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: '2-digit' });
}

/** '04 Sep 2026'. */
export function formatMediumDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(LOCALE, { day: '2-digit', month: 'short', year: 'numeric' });
}

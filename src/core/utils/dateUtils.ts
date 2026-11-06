// Ported from the web client (core/utils/date.utils.ts). Local date fields throughout — an
// expense dated the 1st at 00:30 UTC belongs to the month the user saw on the form.

const LOCALE = 'en-GB';

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function isoDay(date: Date): string {
  return `${monthKey(date)}-${String(date.getDate()).padStart(2, '0')}`;
}

export function todayLocalISODate(): string {
  return isoDay(new Date());
}

/** A rolling range of days, used by the spending chart's buckets. Weeks run Monday to Sunday. */
export type DatePeriod = 'today' | 'this-week';

/** First and last local day ('YYYY-MM-DD', inclusive) of a period, relative to `now`. */
export function periodRange(period: DatePeriod, now = new Date()): { start: string; end: string } {
  if (period === 'today') {
    const today = isoDay(now);
    return { start: today, end: today };
  }
  // getDay() is 0 for Sunday, so shift it to make Monday day 0.
  const daysSinceMonday = (now.getDay() + 6) % 7;
  // Building from y/m/d lets Date roll over month and year ends, and dodges DST hour shifts.
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  return { start: isoDay(monday), end: isoDay(sunday) };
}

/** '2026-10-05' becomes 'Mon 5 Oct'. */
export function formatDayLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
}

function parseDay(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** The local day `days` after a 'YYYY-MM-DD' date (before it when negative). */
export function addDays(isoDate: string, days: number): string {
  const d = parseDay(isoDate);
  return isoDay(new Date(d.getFullYear(), d.getMonth(), d.getDate() + days));
}

/** '2026-09-23' becomes 'Wed'. */
export function formatWeekdayShort(isoDate: string): string {
  return parseDay(isoDate).toLocaleDateString(LOCALE, { weekday: 'short' });
}

/** '2026-09-23' becomes 'Sep'. */
export function formatMonthShort(isoDate: string): string {
  return parseDay(isoDate).toLocaleDateString(LOCALE, { month: 'short' });
}

/** An inclusive range of days, like the Health app: '23–29 Sep 2026', '29 Sep – 5 Oct 2026', '6 Oct 2025 – 5 Oct 2026'. */
export function formatDateRange(start: string, end: string): string {
  const s = parseDay(start);
  const e = parseDay(end);
  const endText = e.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });
  if (s.getFullYear() !== e.getFullYear()) {
    return `${s.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' })} – ${endText}`;
  }
  if (s.getMonth() !== e.getMonth()) return `${s.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' })} – ${endText}`;
  return `${s.getDate()}–${endText}`;
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
  return isoDay(new Date(isoDate));
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

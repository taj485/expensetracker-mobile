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

/** A rolling date filter on the expenses screen. Weeks run Monday to Sunday. */
export type DatePeriod = 'this-week' | 'last-week' | 'today';

export const DATE_PERIODS: readonly DatePeriod[] = ['today', 'this-week', 'last-week'];

/** First and last local day ('YYYY-MM-DD', inclusive) of a period, relative to `now`. */
export function periodRange(period: DatePeriod, now = new Date()): { start: string; end: string } {
  if (period === 'today') {
    const today = isoDay(now);
    return { start: today, end: today };
  }
  // getDay() is 0 for Sunday, so shift it to make Monday day 0.
  const daysSinceMonday = (now.getDay() + 6) % 7;
  const weeksBack = period === 'last-week' ? 1 : 0;
  // Building from y/m/d lets Date roll over month and year ends, and dodges DST hour shifts.
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday - 7 * weeksBack);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  return { start: isoDay(monday), end: isoDay(sunday) };
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const WEEKDAYS: readonly Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** One day of a week period, for the day tabs: { key: 'mon', date: '2026-10-05', name: 'Mon', dayOfMonth: 5, ... }. */
export interface WeekDay {
  key: Weekday;
  date: string;
  name: string;
  dayOfMonth: number;
  /** Still to come, so it can't have expenses yet. */
  isFuture: boolean;
}

/** The seven days, Monday to Sunday, of this week or last week. */
export function weekDays(period: 'this-week' | 'last-week', now = new Date()): WeekDay[] {
  const [year, month, day] = periodRange(period, now).start.split('-').map(Number);
  const today = isoDay(now);
  return WEEKDAYS.map((key, i) => {
    const d = new Date(year, month - 1, day + i);
    const date = isoDay(d);
    return { key, date, name: d.toLocaleDateString(LOCALE, { weekday: 'short' }), dayOfMonth: d.getDate(), isFuture: date > today };
  });
}

/** '2026-10-05' becomes 'Mon 5 Oct'. */
export function formatDayLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
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

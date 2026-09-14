// The API and web client are GBP-only for now (the web app hardcodes "£").
const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

/** 1204.75 → '£1,204.75'. */
export function formatMoney(amount: number): string {
  return gbp.format(amount);
}

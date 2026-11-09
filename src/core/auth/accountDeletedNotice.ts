// One-time hand-off from "Delete account" to the Welcome screen. The root layout's guard routes
// to Welcome on its own once the credentials are cleared, so there are no route params to carry it.
let pending = false;

export function markAccountDeleted(): void {
  pending = true;
}

/** True once after an account deletion, then false. */
export function consumeAccountDeletedNotice(): boolean {
  const wasPending = pending;
  pending = false;
  return wasPending;
}

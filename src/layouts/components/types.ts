/**
 * A loose view of the authenticated user as the layout reads it.
 *
 * The JWT auth `User` (src/types/domain.ts) does not carry `photoURL` /
 * `displayName`; the layout (account drawer, nav upgrade block) optionally
 * renders them. Every field is optional, so the auth `user` stays assignable.
 * Lives here (not in a component file) so sibling layout components can share
 * it without importing one another — avoids a circular dependency.
 */
export interface LayoutUserView {
  photoURL?: string;
  displayName?: string;
  email?: string;
}

// Local, typed path constants for the vendored auth-demo views.
//
// These views are demo-only and reference an `authDemo` namespace that the
// trimmed app-wide `src/routes/paths.ts` does not define (shared-type gap).
// Keeping them here keeps the gap contained to this folder and gives the
// links concrete, statically-typed targets.

const ROOT = "/auth-demo";

interface AuthDemoVariantPaths {
  signIn: string;
  signUp: string;
  verify: string;
  resetPassword: string;
  updatePassword: string;
}

interface AuthDemoPaths {
  centered: AuthDemoVariantPaths;
  split: AuthDemoVariantPaths;
}

export const authDemoPaths: AuthDemoPaths = {
  centered: {
    signIn: `${ROOT}/centered/sign-in`,
    signUp: `${ROOT}/centered/sign-up`,
    verify: `${ROOT}/centered/verify`,
    resetPassword: `${ROOT}/centered/reset-password`,
    updatePassword: `${ROOT}/centered/update-password`,
  },
  split: {
    signIn: `${ROOT}/split/sign-in`,
    signUp: `${ROOT}/split/sign-up`,
    verify: `${ROOT}/split/verify`,
    resetPassword: `${ROOT}/split/reset-password`,
    updatePassword: `${ROOT}/split/update-password`,
  },
};

// Named layout chrome. CSS vars interpolate these — never quote raw px
// at the call site. Values are CSS pixels (MUI sx `width: n` == n px).

export const LAYOUT = {
  navMobileWidth: 320,
  navMiniWidth: 88,
  navVerticalWidth: 300,
  navHorizontalHeight: 64,
  headerBlur: 8,
  headerMobileHeight: 64,
  headerDesktopHeight: 72,
  authContentWidth: 420,
  simpleContentCompactWidth: 448,
  dashboardContentPtHorizontal: 40,
};

export function layoutCssPx(value: number): string {
  return `${value}px`;
}

// @types/react-dom is not installed; only the one function the tests use.
declare module "react-dom/server" {
  export function renderToStaticMarkup(node: React.ReactNode): string;
}

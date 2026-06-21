import { markdownClasses } from "./classes";

import type { ReactMarkdownOptions } from "./types";

// ----------------------------------------------------------------------

type PreComponent = NonNullable<ReactMarkdownOptions["components"]>["pre"];

export const MarkdownPre: PreComponent = ({ children }) => (
  <div className={markdownClasses.content.codeBlock}>
    <pre>{children}</pre>
  </div>
);

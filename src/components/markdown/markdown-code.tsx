import { markdownClasses } from "./classes";

import type { ReactMarkdownOptions } from "./types";

// ----------------------------------------------------------------------

type CodeComponent = NonNullable<ReactMarkdownOptions["components"]>["code"];

export const MarkdownCode: CodeComponent = ({
  className,
  children,
  node: _node,
  ...other
}) => {
  const language = /language-(\w+)/.exec(className || "");

  return language ? (
    <code {...other} className={className}>
      {children}
    </code>
  ) : (
    <code {...other} className={markdownClasses.content.codeInline}>
      {children}
    </code>
  );
};

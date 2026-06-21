import type { ComponentProps } from "react";
import type ReactMarkdown from "react-markdown";

import type { StyledRoot } from "./styles";

// ----------------------------------------------------------------------

export interface MarkdownProps extends ComponentProps<typeof StyledRoot> {
  children?: string;
}

export type ReactMarkdownOptions = ComponentProps<typeof ReactMarkdown>;

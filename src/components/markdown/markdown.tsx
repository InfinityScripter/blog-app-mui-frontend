import "./code-highlight-block.css";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

import { StyledRoot } from "./styles";
import { markdownClasses } from "./classes";
import { components, rehypePlugins } from "./const";
import { htmlToMarkdown, isMarkdownContent } from "./html-to-markdown";

import type { MarkdownProps } from "./types";

// ----------------------------------------------------------------------

export function Markdown({ children, sx, ...other }: MarkdownProps) {
  const content = useMemo(() => {
    const source = `${children ?? ""}`;
    if (isMarkdownContent(source)) {
      return source;
    }
    return htmlToMarkdown(source.trim());
  }, [children]);

  return (
    <StyledRoot className={markdownClasses.root} sx={sx} {...other}>
      <ReactMarkdown
        components={components}
        rehypePlugins={rehypePlugins}
        /* base64-encoded images
         * https://github.com/remarkjs/react-markdown/issues/774
         * urlTransform={(value: string) => value}
         */
      >
        {content}
      </ReactMarkdown>
    </StyledRoot>
  );
}

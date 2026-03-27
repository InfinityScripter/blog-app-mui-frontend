import "./code-highlight-block.css";

import { useMemo } from "react";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "@mui/material/Link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { isExternalLink } from "src/routes/utils";
import { RouterLink } from "src/routes/components";

import { Image } from "../image";
import { StyledRoot } from "./styles";
import { markdownClasses } from "./classes";
import { htmlToMarkdown, isMarkdownContent } from "./html-to-markdown";

// ----------------------------------------------------------------------

export function Markdown({ children, sx, ...other }) {
  const content = useMemo(() => {
    if (isMarkdownContent(`${children}`)) {
      return children;
    }
    return htmlToMarkdown(`${children}`.trim());
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

const rehypePlugins = [
  rehypeRaw,
  rehypeHighlight,
  [remarkGfm, { singleTilde: false }],
];

const components = {
  img: ({ node, ...other }) => (
    <Image
      ratio="16/9"
      className={markdownClasses.content.image}
      sx={{ borderRadius: 2 }}
      {...other}
    />
  ),
  a: ({ href, children, node, ...other }) => {
    const linkProps = isExternalLink(href)
      ? { target: "_blank", rel: "noopener" }
      : { component: RouterLink };

    return (
      <Link
        {...linkProps}
        href={href}
        className={markdownClasses.content.link}
        {...other}
      >
        {children}
      </Link>
    );
  },
  pre: ({ children }) => (
    <div className={markdownClasses.content.codeBlock}>
      <pre>{children}</pre>
    </div>
  ),
  code({ className, children, node, ...other }) {
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
  },
};

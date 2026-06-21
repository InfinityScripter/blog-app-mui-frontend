import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

import { MarkdownPre } from "./markdown-pre";
import { MarkdownCode } from "./markdown-code";
import { MarkdownLink } from "./markdown-link";
import { MarkdownImage } from "./markdown-image";

import type { ReactMarkdownOptions } from "./types";

// ----------------------------------------------------------------------

export const rehypePlugins: ReactMarkdownOptions["rehypePlugins"] = [
  rehypeRaw,
  rehypeHighlight,
  [remarkGfm, { singleTilde: false }],
];

export const components: ReactMarkdownOptions["components"] = {
  img: MarkdownImage,
  a: MarkdownLink,
  pre: MarkdownPre,
  code: MarkdownCode,
};

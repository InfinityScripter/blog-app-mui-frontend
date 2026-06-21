import { Image } from "../image";
import { markdownClasses } from "./classes";

import type { ReactMarkdownOptions } from "./types";

// ----------------------------------------------------------------------

type ImageComponent = NonNullable<ReactMarkdownOptions["components"]>["img"];

export const MarkdownImage: ImageComponent = ({ src, alt, title }) => (
  <Image
    ratio="16/9"
    src={typeof src === "string" ? src : undefined}
    alt={alt}
    title={title}
    className={markdownClasses.content.image}
    sx={{ borderRadius: 2 }}
  />
);

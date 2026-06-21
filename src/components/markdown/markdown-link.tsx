import Link from "@mui/material/Link";
import { isExternalLink } from "src/routes/utils";
import { RouterLink } from "src/routes/components";

import { markdownClasses } from "./classes";

import type { ReactMarkdownOptions } from "./types";

// ----------------------------------------------------------------------

type LinkComponent = NonNullable<ReactMarkdownOptions["components"]>["a"];

export const MarkdownLink: LinkComponent = ({
  href,
  children,
  node: _node,
  ...other
}) => {
  const linkProps = isExternalLink(href ?? "")
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
};

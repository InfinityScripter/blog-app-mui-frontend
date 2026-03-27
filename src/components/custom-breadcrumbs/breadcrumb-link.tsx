import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export interface BreadcrumbLinkItem {
  name?: ReactNode;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsLinkProps {
  link: BreadcrumbLinkItem;
  activeLast?: boolean;
  disabled?: boolean;
}

export function BreadcrumbsLink({
  link,
  activeLast,
  disabled,
}: BreadcrumbsLinkProps) {
  const styles = {
    typography: "body2",
    alignItems: "center",
    color: "text.primary",
    display: "inline-flex",
    ...(disabled &&
      !activeLast && {
        cursor: "default",
        pointerEvents: "none",
        color: "text.disabled",
      }),
  };

  const renderContent = (
    <>
      {link.icon && (
        <Box
          component="span"
          sx={{
            mr: 1,
            display: "inherit",
            "& svg, & img": {
              width: 20,
              height: 20,
            },
          }}
        >
          {link.icon}
        </Box>
      )}

      {link.name}
    </>
  );

  if (link.href) {
    return (
      <Link component={RouterLink} href={link.href} sx={styles}>
        {renderContent}
      </Link>
    );
  }

  return <Box sx={styles}> {renderContent} </Box>;
}

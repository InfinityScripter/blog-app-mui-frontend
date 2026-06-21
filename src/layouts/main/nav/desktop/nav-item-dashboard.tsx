import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { CONFIG } from "src/config-global";
import { RouterLink } from "src/routes/components";
import CardActionArea from "@mui/material/CardActionArea";

import type { NavItemDashboardProps } from "./types";

// ----------------------------------------------------------------------

export function NavItemDashboard({
  path,
  sx,
  ...other
}: NavItemDashboardProps) {
  return (
    <Link
      component={RouterLink}
      href={path}
      // Dashboard CTA in the public mega-menu — don't prefetch the heavy route.
      prefetch={false}
      sx={{ width: 1, height: 1 }}
      {...other}
    >
      <CardActionArea
        sx={{
          height: 1,
          minHeight: 360,
          borderRadius: 1.5,
          color: "text.disabled",
          bgcolor: "background.neutral",
          px: { md: 3, lg: 10 },
          ...sx,
        }}
      >
        <m.div
          whileTap="tap"
          whileHover="hover"
          variants={{ hover: { scale: 1.02 }, tap: { scale: 0.98 } }}
        >
          <Box
            component="img"
            alt="illustration-dashboard"
            src={`${CONFIG.site.basePath}/assets/illustrations/illustration-dashboard.webp`}
            sx={{
              width: 640,
              objectFit: "cover",
              aspectRatio: "4/3",
            }}
          />
        </m.div>
      </CardActionArea>
    </Link>
  );
}

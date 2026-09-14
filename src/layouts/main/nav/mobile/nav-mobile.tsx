import { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Logo } from "src/components/logo";
import { usePathname } from "src/routes/hooks";
import { NavUl } from "src/components/nav-section";
import { Scrollbar } from "src/components/scrollbar";

import { NavList } from "./nav-mobile-list";
import { SignInButton } from "../../../components/sign-in-button";

import type { NavMobileProps } from "./types";

// ----------------------------------------------------------------------

export function NavMobile({ data, open, onClose, slots, sx }: NavMobileProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            width: "var(--layout-nav-mobile-width)",
            ...sx,
          },
        },
      }}
    >
      {slots?.topArea ?? (
        <Box
          sx={{
            display: "flex",
            pt: 3,
            pb: 2,
            pl: 2.5,
          }}
        >
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            pb: 3,
          }}
        >
          <NavUl>
            {data.map((list) => (
              <NavList key={list.title} data={list} />
            ))}
          </NavUl>
        </Box>
      </Scrollbar>

      {slots?.bottomArea ?? (
        <Box
          sx={{
            display: "flex",
            px: 2.5,
            py: 3,
          }}
        >
          <SignInButton fullWidth />
        </Box>
      )}
    </Drawer>
  );
}

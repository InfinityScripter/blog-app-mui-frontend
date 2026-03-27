"use client";

import type { Theme, SxProps } from "@mui/material/styles";

import { m } from "framer-motion";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ForbiddenIllustration } from "src/assets/illustrations";
import { varBounce, MotionContainer } from "src/components/animate";

// ----------------------------------------------------------------------

interface RoleBasedGuardProps {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  hasContent?: boolean;
  currentRole?: string;
  acceptRoles?: string[];
}

export function RoleBasedGuard({
  sx,
  children,
  hasContent = true,
  currentRole,
  acceptRoles,
}: RoleBasedGuardProps) {
  if (
    typeof acceptRoles !== "undefined" &&
    currentRole &&
    !acceptRoles.includes(currentRole)
  ) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={{ textAlign: "center", ...sx }}
      >
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            You do not have permission to access this page.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}

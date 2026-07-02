import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { monoLabelSx } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";

import type { AuthSplitSectionProps } from "./types";

// ----------------------------------------------------------------------

// Editorial Ink: левая брендовая панель — чернильная плита без иллюстраций,
// Unbounded-заголовок + mono-теглайн.
export function Section({
  sx,
  method,
  layoutQuery,
  methods,
  title = "AI-журнал: разборы, новости, практика",
  subtitle = "LLM · агенты · Claude Code",
  ...other
}: AuthSplitSectionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 3,
        pb: 3,
        width: 1,
        maxWidth: 480,
        display: "none",
        position: "relative",
        color: "common.white",
        bgcolor: "grey.900",
        pt: "var(--layout-header-desktop-height)",
        [theme.breakpoints.up(layoutQuery)]: {
          gap: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        },
        ...sx,
      }}
      {...other}
    >
      <div>
        <Typography variant="h2" component="h1" sx={{ textAlign: "center" }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography
            component="p"
            sx={{
              ...monoLabelSx,
              color: "grey.400",
              textAlign: "center",
              mt: 3,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </div>

      {!!methods?.length && method && (
        <Box component="ul" gap={2} display="flex">
          {methods.map((option) => {
            const selected = method === option.label.toLowerCase();

            return (
              <Box
                key={option.label}
                component="li"
                sx={{
                  ...(!selected && {
                    cursor: "not-allowed",
                    filter: "grayscale(1)",
                  }),
                }}
              >
                <Tooltip title={option.label} placement="top">
                  <Link
                    component={RouterLink}
                    href={option.path}
                    sx={{
                      ...(!selected && { pointerEvents: "none" }),
                    }}
                  >
                    <Box
                      component="img"
                      alt={option.label}
                      src={option.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

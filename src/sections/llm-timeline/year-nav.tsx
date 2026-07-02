import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { varAlpha } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";

// ----------------------------------------------------------------------

interface YearNavProps {
  years: number[];
  activeYear: number | null;
  onJump: (year: number) => void;
}

/**
 * Sticky year rail under the header: one chip per visible year. The chip of
 * the year currently on screen is highlighted (scrollspy); clicking a chip
 * smooth-scrolls to that year's first model.
 */
export function YearNav({ years, activeYear, onJump }: YearNavProps) {
  const theme = useTheme();

  if (years.length < 2) return null;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 8,
        zIndex: 9,
        display: "flex",
        gap: 0.75,
        mb: { xs: 3, md: 4 },
        p: 0.75,
        borderRadius: 2,
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        bgcolor: varAlpha(theme.vars.palette.background.defaultChannel, 0.85),
        border: `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      {years.map((year) => (
        <Chip
          key={year}
          label={year}
          size="small"
          clickable
          color="primary"
          variant={year === activeYear ? "filled" : "soft"}
          onClick={() => onJump(year)}
          sx={{ flexShrink: 0, fontWeight: 600 }}
        />
      ))}
    </Box>
  );
}

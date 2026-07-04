import type { FaqItem } from "src/utils/post-geo-content";

import Box from "@mui/material/Box";
import { monoLabelSx } from "src/theme/styles";
import Accordion from "@mui/material/Accordion";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { Markdown } from "src/components/markdown";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

// ----------------------------------------------------------------------

// FAQ block parsed from the post's `## FAQ` section. Editorial Ink: a
// hairline-ruled disclosure list, NOT a card stack. A vermilion `+` sign
// rotates to `×` on expand (no default chevron). Renders nothing without items.

interface PostFaqProps {
  items: FaqItem[];
}

export function PostFaq({ items }: PostFaqProps) {
  if (items.length === 0) return null;

  return (
    <Box sx={{ my: 5 }}>
      <Box component="p" sx={{ ...monoLabelSx, m: 0, mb: 0.5 }}>
        Ответы
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Частые вопросы
      </Typography>

      {items.map((item, index) => (
        <Accordion
          key={item.question}
          disableGutters
          elevation={0}
          square
          sx={{
            bgcolor: "transparent",
            borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
            ...(index === items.length - 1 && {
              borderBottom: (theme) =>
                `1px solid ${theme.vars.palette.divider}`,
            }),
            "&::before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={
              <Iconify
                icon="mingcute:add-line"
                width={20}
                sx={{
                  color: "primary.main",
                  transition: (theme) =>
                    theme.transitions.create("transform", {
                      duration: theme.transitions.duration.shorter,
                    }),
                }}
              />
            }
            sx={{
              px: 0,
              py: 1,
              "& .MuiAccordionSummary-content": { my: 1 },
              "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(45deg)",
              },
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "1.0625rem" }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
            <Markdown children={item.answer} sx={{ color: "text.secondary" }} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

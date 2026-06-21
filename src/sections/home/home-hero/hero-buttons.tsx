import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { Iconify } from "src/components/iconify";
import { marketingHeroCtaRowSx } from "src/theme/styles";

import { MInview } from "./m-inview";

// ----------------------------------------------------------------------

// Кнопки для перехода к портфолио и статьям
export function HeroButtons() {
  return (
    <Box sx={marketingHeroCtaRowSx}>
      <MInview>
        <Button
          component={Link}
          href="/portfolio"
          color="primary"
          size="large"
          variant="contained"
          startIcon={
            <Iconify width={24} icon="solar:user-circle-bold-duotone" />
          }
        >
          Обо мне
        </Button>
      </MInview>
      <MInview>
        <Button
          component={Link}
          href="/post"
          color="primary"
          size="large"
          variant="outlined"
          startIcon={
            <Iconify width={24} icon="mdi:newspaper-variant-outline" />
          }
        >
          Читать блог
        </Button>
      </MInview>
    </Box>
  );
}

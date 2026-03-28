import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CONFIG } from "src/config-global";
import { maxLine } from "src/theme/styles";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { useBoolean } from "src/hooks/use-boolean";
import ListItemButton from "@mui/material/ListItemButton";

// ----------------------------------------------------------------------

const CATEGORIES = [
  {
    label: "Управление аккаунтом",
    icon: `${CONFIG.site.basePath}/assets/icons/faqs/ic-account.svg`,
    href: "#",
  },
  {
    label: "Оплата",
    icon: `${CONFIG.site.basePath}/assets/icons/faqs/ic-payment.svg`,
    href: "#",
  },
  {
    label: "Доставка",
    icon: `${CONFIG.site.basePath}/assets/icons/faqs/ic-delivery.svg`,
    href: "#",
  },
  {
    label: "Проблема с продуктом",
    icon: `${CONFIG.site.basePath}/assets/icons/faqs/ic-package.svg`,
    href: "#",
  },
  {
    label: "Возврат и компенсация",
    icon: `${CONFIG.site.basePath}/assets/icons/faqs/ic-refund.svg`,
    href: "#",
  },
  {
    label: "Гарантии и условия",
    icon: `${CONFIG.site.basePath}/assets/icons/faqs/ic-assurances.svg`,
    href: "#",
  },
];

// ----------------------------------------------------------------------

export function FaqsCategory() {
  const nav = useBoolean();

  const renderMobile = (
    <>
      <Box
        sx={{
          p: 2,
          top: 0,
          left: 0,
          width: 1,
          position: "absolute",
          display: { xs: "block", md: "none" },
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Button
          startIcon={<Iconify icon="solar:list-bold" />}
          onClick={nav.onTrue}
        >
          Категории
        </Button>
      </Box>

      <Drawer open={nav.value} onClose={nav.onFalse}>
        <Box
          gap={1}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 1 }}
        >
          {CATEGORIES.map((category) => (
            <CardMobile key={category.label} category={category} />
          ))}
        </Box>
      </Drawer>
    </>
  );

  const renderDesktop = (
    <Box
      gap={3}
      display={{ xs: "none", md: "grid" }}
      gridTemplateColumns={{ md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" }}
    >
      {CATEGORIES.map((category) => (
        <CardDesktop key={category.label} category={category} />
      ))}
    </Box>
  );

  return (
    <>
      {renderMobile}
      {renderDesktop}
    </>
  );
}

function CardDesktop({ category }) {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "unset",
        cursor: "pointer",
        textAlign: "center",
        "&:hover": {
          bgcolor: "background.paper",
          boxShadow: theme.customShadows.z20,
        },
      }}
    >
      <Avatar
        alt={category.icon}
        src={category.icon}
        sx={{
          mb: 2,
          width: 80,
          height: 80,
          mx: "auto",
        }}
      />

      <Typography
        variant="subtitle2"
        sx={{ ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }) }}
      >
        {category.label}
      </Typography>
    </Paper>
  );
}

// ----------------------------------------------------------------------

function CardMobile({ category }) {
  return (
    <ListItemButton
      key={category.label}
      sx={{
        py: 2,
        maxWidth: 140,
        borderRadius: 1,
        textAlign: "center",
        alignItems: "center",
        typography: "subtitle2",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: "background.neutral",
      }}
    >
      <Avatar
        alt={category.icon}
        src={category.icon}
        sx={{ width: 48, height: 48, mb: 1 }}
      />

      {category.label}
    </ListItemButton>
  );
}

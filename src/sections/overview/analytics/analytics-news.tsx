import type { BoxProps } from "@mui/material/Box";
import type { CardProps } from "@mui/material/Card";
import type { ReactNode, ComponentType } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { fToNow } from "src/utils/format-time";
import { Iconify } from "src/components/iconify";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import { Scrollbar as RawScrollbar } from "src/components/scrollbar";

// ----------------------------------------------------------------------

// `Scrollbar` is a shared `forwardRef` component without exported prop types;
// re-type it precisely at the call site (no runtime change) so it accepts
// `children`/`sx` without resorting to `any`.
const Scrollbar = RawScrollbar as unknown as ComponentType<{
  children?: ReactNode;
  sx?: SxProps<Theme>;
}>;

interface NewsItem {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  postedAt: string | number | null;
}

interface AnalyticsNewsProps extends Omit<CardProps, "title"> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  list: NewsItem[];
}

export function AnalyticsNews({
  title,
  subheader,
  list,
  ...other
}: AnalyticsNewsProps) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ minHeight: 405 }}>
        <Box sx={{ minWidth: 640 }}>
          {list.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={18}
              sx={{ ml: -0.5 }}
            />
          }
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

interface ItemProps extends BoxProps {
  item: NewsItem;
}

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        gap: 2,
        display: "flex",
        alignItems: "center",
        borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
        ...sx,
      }}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.title}
        src={item.coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={item.title}
        secondary={item.description}
        primaryTypographyProps={{ noWrap: true, typography: "subtitle2" }}
        secondaryTypographyProps={{ mt: 0.5, noWrap: true, component: "span" }}
      />

      <Box
        sx={{ flexShrink: 0, color: "text.disabled", typography: "caption" }}
      >
        {fToNow(item.postedAt)}
      </Box>
    </Box>
  );
}

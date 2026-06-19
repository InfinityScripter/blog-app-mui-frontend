import type { BoxProps } from "@mui/material/Box";
import type { CardProps } from "@mui/material/Card";
import type { ReactNode, ComponentType } from "react";
import type { Theme, SxProps } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Iconify } from "src/components/iconify";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import { Scrollbar } from "src/components/scrollbar";
import ListItemText from "@mui/material/ListItemText";

// ----------------------------------------------------------------------

// The shared `Scrollbar` is an untyped `forwardRef` (its props are not declared
// in src/components/scrollbar/scrollbar.tsx), so the call site cannot pass
// `children`/`sx` without re-typing it. Fixing this at the source is out of this
// cluster's scope; re-type here (no runtime change).
interface ScrollbarProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}
const ScrollContainer = Scrollbar as unknown as ComponentType<ScrollbarProps>;

interface BankingContact {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface BankingContactsProps extends Omit<CardProps, "title"> {
  title?: string;
  subheader?: string;
  list: BankingContact[];
}

export function BankingContacts({
  title,
  subheader,
  list,
  ...other
}: BankingContactsProps) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
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
        }
      />

      <ScrollContainer sx={{ minHeight: 364 }}>
        <Box
          sx={{
            p: 3,
            gap: 3,
            display: "flex",
            flexDirection: "column",
            minWidth: 360,
          }}
        >
          {list.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Box>
      </ScrollContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface ItemProps extends BoxProps {
  item: BankingContact;
  sx?: SxProps<Theme>;
}

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      key={item.id}
      sx={{ gap: 2, display: "flex", alignItems: "center", ...sx }}
      {...other}
    >
      <Avatar src={item.avatarUrl} />

      <ListItemText primary={item.name} secondary={item.email} />

      <Tooltip title="Quick transfer">
        <IconButton>
          <Iconify icon="solar:transfer-horizontal-bold-duotone" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

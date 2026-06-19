import type { BoxProps } from "@mui/material/Box";
import type { CardProps } from "@mui/material/Card";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { fDateTime } from "src/utils/format-time";
import AutoHeight from "embla-carousel-auto-height";
import ListItemText from "@mui/material/ListItemText";
import {
  Carousel,
  useCarousel,
  CarouselArrowBasicButtons,
} from "src/components/carousel";

// ----------------------------------------------------------------------

interface BookingReviewItem {
  id: string;
  name: string;
  avatarUrl: string;
  postedAt: string | number | Date;
  rating: number;
  description: string;
  tags: string[];
}

interface BookingCustomerReviewsProps extends Omit<CardProps, "title"> {
  title?: string;
  subheader?: string;
  list: BookingReviewItem[];
}

export function BookingCustomerReviews({
  title,
  subheader,
  list,
  ...other
}: BookingCustomerReviewsProps) {
  const carousel = useCarousel({ align: "start" }, [AutoHeight()]);

  const customerInfo = list.find(
    (_, index) => index === carousel.dots.selectedIndex,
  );

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={<CarouselArrowBasicButtons {...carousel.arrows} />}
      />

      <Carousel carousel={carousel}>
        {list.map((item: BookingReviewItem) => (
          <Item key={item.id} item={item} />
        ))}
      </Carousel>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 3, gap: 2, display: "flex" }}>
        <Button
          fullWidth
          color="error"
          variant="soft"
          onClick={() => console.info("ACCEPT", customerInfo?.id)}
        >
          Reject
        </Button>

        <Button
          fullWidth
          color="inherit"
          variant="contained"
          onClick={() => console.info("REJECT", customerInfo?.id)}
        >
          Accept
        </Button>
      </Box>
    </Card>
  );
}

interface ItemProps extends BoxProps {
  item: BookingReviewItem;
}

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      sx={{
        p: 3,
        gap: 2,
        display: "flex",
        position: "relative",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          gap: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          alt={item.name}
          src={item.avatarUrl}
          sx={{ width: 48, height: 48 }}
        />

        <ListItemText
          primary={item.name}
          secondary={`Posted ${fDateTime(item.postedAt)}`}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
            color: "text.disabled",
          }}
        />
      </Box>

      <Rating value={item.rating} size="small" readOnly precision={0.5} />

      <Typography variant="body2">{item.description}</Typography>

      <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap" }}>
        {item.tags.map((tag: string) => (
          <Chip size="small" variant="soft" key={tag} label={tag} />
        ))}
      </Box>
    </Box>
  );
}

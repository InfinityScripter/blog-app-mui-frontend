"use client";

import { paths } from "src/routes/paths";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { EmptyContent } from "src/components/empty-content";

// ----------------------------------------------------------------------

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <Container sx={{ my: 5 }}>
      <EmptyContent
        filled
        title="Post not found!"
        action={
          <Button
            component={RouterLink}
            href={paths.post.root}
            startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
            sx={{ mt: 3 }}
          >
            Back to list
          </Button>
        }
        sx={{ py: 10 }}
      />
    </Container>
  );
}

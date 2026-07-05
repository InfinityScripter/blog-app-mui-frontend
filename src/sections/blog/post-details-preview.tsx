"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Markdown } from "src/components/markdown";
import { Scrollbar } from "src/components/scrollbar";
import DialogActions from "@mui/material/DialogActions";
import { formatImageUrl } from "src/utils/format-image-url";
import { EmptyContent } from "src/components/empty-content";

import { PostDetailsHero } from "./post-details-hero";

import type { PostDetailsPreviewProps } from "./types";

// ----------------------------------------------------------------------

export function PostDetailsPreview({
  open,
  title,
  content,
  isValid,
  onClose,
  coverUrl,
  onSubmit,
  description,
  isSubmitting,
}: PostDetailsPreviewProps) {
  const t = useTranslations("blog");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (coverUrl) {
      if (typeof coverUrl === "string") {
        setPreviewUrl(formatImageUrl(coverUrl));
      } else {
        setPreviewUrl(URL.createObjectURL(coverUrl));
      }
    }
  }, [coverUrl]);

  const hasHero = title || previewUrl;

  const hasContent = title || description || content || previewUrl;

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t("preview.title")}
        </Typography>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t("preview.cancel")}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {t("preview.submit")}
        </LoadingButton>
      </DialogActions>

      <Divider />

      {hasContent ? (
        <Scrollbar>
          {(hasHero || previewUrl) && (
            <PostDetailsHero title={title} coverUrl={previewUrl} />
          )}
          <Container sx={{ mt: 5, mb: 10 }}>
            <Stack sx={{ mx: "auto", maxWidth: 720 }}>
              <Typography variant="h6">{description}</Typography>
              <Markdown>{content}</Markdown>
            </Stack>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent filled title={t("preview.empty")} />
      )}
    </Dialog>
  );
}

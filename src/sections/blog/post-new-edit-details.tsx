"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTranslations } from "next-intl";
import { Field } from "src/components/hook-form";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import type { PostNewEditDetailsProps } from "./types";

// ----------------------------------------------------------------------

export function PostNewEditDetails({ onRemoveFile }: PostNewEditDetailsProps) {
  const t = useTranslations("blog");

  return (
    <Card>
      <CardHeader
        title={t("form.detailsTitle")}
        subheader={t("form.detailsSubheader")}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label={t("form.fieldTitle")} />

        <Field.Text
          name="description"
          label={t("form.fieldDescription")}
          multiline
          rows={3}
        />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{t("form.fieldContent")}</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">{t("form.fieldCover")}</Typography>
          <Field.Upload
            name="coverUrl"
            maxSize={3145728}
            onDelete={onRemoveFile}
          />
        </Stack>
      </Stack>
    </Card>
  );
}

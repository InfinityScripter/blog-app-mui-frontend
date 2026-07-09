"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTranslations } from "next-intl";
import { Field } from "src/components/hook-form";
import CardHeader from "@mui/material/CardHeader";

import { TAG_SUGGESTIONS } from "./const";
import { renderTagOption } from "./post-new-edit-properties-tag-option";
import { renderSelectedTags } from "./post-new-edit-properties-selected-tags";

// ----------------------------------------------------------------------

export function PostNewEditProperties() {
  const t = useTranslations("blog");

  return (
    <Card>
      <CardHeader
        title={t("form.propertiesTitle")}
        subheader={t("form.propertiesSubheader")}
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Autocomplete
          name="tags"
          label={t("form.fieldTags")}
          placeholder={t("form.fieldTagsPlaceholder")}
          multiple
          freeSolo
          disableCloseOnSelect
          options={TAG_SUGGESTIONS}
          getOptionLabel={(option: string) => option}
          renderOption={renderTagOption}
          renderTags={renderSelectedTags}
        />

        <Field.Text name="metaTitle" label={t("form.fieldMetaTitle")} />

        <Field.Text
          name="metaDescription"
          label={t("form.fieldMetaDescription")}
          fullWidth
          multiline
          rows={3}
        />

        <Field.Autocomplete
          name="metaKeywords"
          label={t("form.fieldMetaKeywords")}
          placeholder={t("form.fieldMetaKeywordsPlaceholder")}
          multiple
          freeSolo
          disableCloseOnSelect
          options={TAG_SUGGESTIONS}
          getOptionLabel={(option: string) => option}
          renderOption={renderTagOption}
          renderTags={renderSelectedTags}
        />
      </Stack>
    </Card>
  );
}

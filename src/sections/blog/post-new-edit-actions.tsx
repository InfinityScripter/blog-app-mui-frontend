"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { useTranslations } from "next-intl";
import LoadingButton from "@mui/lab/LoadingButton";
import { Controller, useFormContext } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";

import type { PostNewEditActionsProps } from "./types";

// ----------------------------------------------------------------------

export function PostNewEditActions({
  isEdit,
  isSubmitting,
  onPreview,
}: PostNewEditActionsProps) {
  const { control } = useFormContext();
  const t = useTranslations("blog");

  return (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      justifyContent="flex-end"
    >
      <Controller
        name="publish"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            control={
              <Switch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
            }
            label={t("form.publish")}
            sx={{ pl: 3, flexGrow: 1 }}
          />
        )}
      />

      <div>
        <Button
          color="inherit"
          variant="outlined"
          size="large"
          onClick={onPreview}
        >
          {t("form.preview")}
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!isEdit ? t("form.create") : t("form.save")}
        </LoadingButton>
      </div>
    </Box>
  );
}

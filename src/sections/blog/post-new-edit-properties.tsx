import type { ReactNode, HTMLAttributes } from "react";
import type { AutocompleteRenderGetTagProps } from "@mui/material/Autocomplete";

import { _tags } from "src/_mock";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import { Field } from "src/components/hook-form";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";

// ----------------------------------------------------------------------

const renderTagOption = (
  props: HTMLAttributes<HTMLLIElement>,
  option: string,
): ReactNode => (
  <li {...props} key={option}>
    {option}
  </li>
);

const renderSelectedTags = (
  selected: string[],
  getTagProps: AutocompleteRenderGetTagProps,
): ReactNode =>
  selected.map((option, index) => (
    <Chip
      {...getTagProps({ index })}
      key={option}
      label={option}
      size="small"
      color="info"
      variant="soft"
    />
  ));

export function PostNewEditProperties() {
  return (
    <Card>
      <CardHeader
        title="Свойства"
        subheader="Дополнительные функции и атрибуты..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Autocomplete
          name="tags"
          label="Теги"
          placeholder="+ Теги"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option: string) => option}
          renderOption={renderTagOption}
          renderTags={renderSelectedTags}
        />

        <Field.Text name="metaTitle" label="Мета-заголовок" />

        <Field.Text
          name="metaDescription"
          label="Мета-описание"
          fullWidth
          multiline
          rows={3}
        />

        <Field.Autocomplete
          name="metaKeywords"
          label="Мета-ключевые слова"
          placeholder="+ Ключевые слова"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option: string) => option}
          renderOption={renderTagOption}
          renderTags={renderSelectedTags}
        />

        <FormControlLabel
          control={
            <Switch defaultChecked inputProps={{ id: "comments-switch" }} />
          }
          label="Включить комментарии"
        />
      </Stack>
    </Card>
  );
}

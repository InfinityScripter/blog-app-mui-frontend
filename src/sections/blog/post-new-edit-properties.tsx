import { _tags } from "src/_mock";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import { Field } from "src/components/hook-form";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";

import { renderTagOption } from "./post-new-edit-properties-tag-option";
import { renderSelectedTags } from "./post-new-edit-properties-selected-tags";

// ----------------------------------------------------------------------

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

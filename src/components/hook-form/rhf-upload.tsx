import FormHelperText from "@mui/material/FormHelperText";
import { Controller, useFormContext } from "react-hook-form";

import { Upload, UploadBox, UploadAvatar } from "../upload";

import type {
  RHFUploadProps,
  RHFUploadBoxProps,
  RHFUploadAvatarProps,
} from "./types";

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: RHFUploadAvatarProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar
              value={field.value}
              error={!!error}
              onDrop={onDrop}
              {...other}
            />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: RHFUploadBoxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <UploadBox error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({
  name,
  multiple,
  helperText,
  ...other
}: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { "image/*": [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple
            ? [...field.value, ...acceptedFiles]
            : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Upload
            {...uploadProps}
            value={field.value}
            onDrop={onDrop}
            {...other}
          />
        );
      }}
    />
  );
}

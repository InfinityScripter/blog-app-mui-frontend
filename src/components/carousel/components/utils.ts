import type { SystemStyleObject } from "@mui/system";
import type { Theme, SxProps } from "@mui/material/styles";

// ----------------------------------------------------------------------

type SxArrayItem =
  | boolean
  | SystemStyleObject<Theme>
  | ((theme: Theme) => SystemStyleObject<Theme>);

export function mergeSx(
  base: SystemStyleObject<Theme>,
  extra?: SxProps<Theme>,
): SxProps<Theme> {
  const extraItems: SxArrayItem[] = extra
    ? Array.isArray(extra)
      ? [...extra]
      : [extra]
    : [];

  return [base, ...extraItems];
}

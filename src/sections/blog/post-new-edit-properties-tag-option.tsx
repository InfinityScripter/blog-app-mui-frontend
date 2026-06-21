import type { ReactNode, HTMLAttributes } from "react";

// ----------------------------------------------------------------------

export const renderTagOption = (
  props: HTMLAttributes<HTMLLIElement>,
  option: string,
): ReactNode => (
  <li {...props} key={option}>
    {option}
  </li>
);

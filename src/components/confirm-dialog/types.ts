import type { ReactNode } from "react";
import type { DialogProps } from "@mui/material/Dialog";

// ----------------------------------------------------------------------

export interface ConfirmDialogProps
  extends Omit<DialogProps, "title" | "content"> {
  title?: ReactNode;
  content?: ReactNode;
  action?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  confirmColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  loading?: boolean;
  onConfirm?: () => void;
}

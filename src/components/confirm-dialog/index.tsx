import type { ReactNode } from "react";
import type { DialogProps } from "@mui/material/Dialog";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

// ----------------------------------------------------------------------

interface ConfirmDialogProps extends Omit<DialogProps, "title" | "content"> {
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

export function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  maxWidth = "xs",
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmColor = "primary",
  loading = false,
  onConfirm,
  ...other
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onClose?.({}, "escapeKeyDown");
  };

  return (
    <Dialog
      fullWidth
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: "body2" }}>{content}</DialogContent>
      )}

      <DialogActions>
        {action || (
          <>
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              {cancelText}
            </Button>

            {onConfirm && (
              <LoadingButton
                variant="contained"
                color={confirmColor}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmText}
              </LoadingButton>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

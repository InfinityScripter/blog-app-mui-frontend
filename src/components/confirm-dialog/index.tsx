import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import type { ConfirmDialogProps } from "./types";

// ----------------------------------------------------------------------

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
              <Button
                variant="contained"
                color={confirmColor}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmText}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

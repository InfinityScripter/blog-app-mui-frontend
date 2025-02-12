import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  maxWidth = 'xs',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmColor = 'primary',
  loading = false,
  onConfirm,
  ...other
}) {
  return (
    <Dialog fullWidth maxWidth={maxWidth} open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2' }}>
          {content}
        </DialogContent>
      )}

      <DialogActions>
        {action || (
          <>
            <Button variant="outlined" color="inherit" onClick={onClose}>
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

ConfirmDialog.propTypes = {
  action: PropTypes.node,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
  confirmText: PropTypes.string,
  content: PropTypes.node,
  loading: PropTypes.bool,
  maxWidth: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export interface CustomDialogProps {
  title: string;
  primaryButtonLabel: string;
  isForm?: boolean;
  formLabel?: string;
  done: (canceled?: boolean, string?: string) => void | Promise<void>;
}

export const CustomDialog = React.forwardRef(function (
  {
    title,
    done,
    primaryButtonLabel,
    formLabel,
    isForm = false,
  }: CustomDialogProps,
  ref
) {
  const [formValue, setFormValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  React.useImperativeHandle(ref, () => ({
    show() {
      setOpen(true);
    },
  }));

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          done(true);
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {isForm && (
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={formLabel}
              fullWidth
              variant="standard"
              onChange={(e) => {
                setFormValue(e.target.value);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              done(true);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              done(false, formValue);
            }}
          >
            {primaryButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

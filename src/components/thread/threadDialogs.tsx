import { Thread } from '@/interfaces/thread';
import noPropagate from '@/utils/onClickHandlers';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { forwardRef, RefObject } from 'react';
import BareContainer from '../wrapper/bareContainer';

export const ThreadReportDialog = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog> & {
    thread: Thread;
    reportRef: RefObject<HTMLInputElement | null>;
    handleReport: (e: React.MouseEvent<HTMLElement>) => void;
  }
>(({ thread, handleReport, reportRef, ...props }, _ref) => {
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (props.onClose) {
      props.onClose({}, 'backdropClick');
    }
  };
  const theme = useTheme();

  return (
    <Dialog {...props} ref={_ref}>
      <DialogTitle>Report Thread</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <BareContainer>
            <Typography>{`ID: ${thread.id}`}</Typography>
            <Typography>{`Title: ${thread.title}`}</Typography>
            <Typography>{`Original Poster: ${thread.username}`}</Typography>
          </BareContainer>
          <TextField
            sx={{
              width: '30ch',
              [theme.breakpoints.up('sm')]: { width: '50ch' },
            }}
            rows={4}
            multiline
            label="Reason"
            placeholder="Tell us more what's wrong about this thread..."
            inputRef={reportRef}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleReport}>Report</Button>
      </DialogActions>
    </Dialog>
  );
});

ThreadReportDialog.displayName = 'ThreadReportDialog';

export const ThreadDeleteDialog = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog> & {
    thread: Thread;
    handleDeleteThread: (e: React.MouseEvent<HTMLElement>) => void;
  }
>(({ thread, handleDeleteThread, ...props }, _ref) => {

  const handleClose = noPropagate(() => {
    if (props.onClose) {
      props.onClose({}, 'backdropClick');
    }
  });
  
  return (
    <Dialog {...props} ref={_ref}>
      <DialogTitle>{`Delete thread?`}</DialogTitle>
      <DialogContent>
        <Typography>{`Title: ${thread.title}`}</Typography>
        <Typography>{`ID: ${thread.id}`}</Typography>
        <Typography>&nbsp;</Typography>
        <Typography>{`Are you sure you want to delete this thread?`}</Typography>
        <Typography color="warning">
          This action is <b>irreversible</b>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteThread}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
});

ThreadDeleteDialog.displayName = 'CommentDeleteDialog';

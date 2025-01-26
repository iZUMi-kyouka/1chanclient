import theme from '@/app/[locale]/theme';
import Comment from '@/interfaces/comment';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import React, { forwardRef, RefObject } from 'react';
import BareContainer from '../wrapper/bareContainer';

export const CommentReportDialog = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog> & {
    comment: Comment;
    reportRef: RefObject<HTMLInputElement | null>;
    handleReport: () => void;
  }
>(({ comment, handleReport, reportRef, ...props }, _ref) => {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...props} ref={_ref}>
      <DialogTitle>Report Comment</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
          }}
        >
          <BareContainer>
            <Typography>{`ID: ${comment.id}`}</Typography>
            <Typography>{`Commenter: ${comment.username}`}</Typography>
          </BareContainer>
          <TextField
            sx={{
              width: '30ch',
              [theme.breakpoints.up('sm')]: { width: '50ch' },
            }}
            rows={6}
            multiline
            label="Reason"
            placeholder="Tell us more what's wrong about this comment..."
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

CommentReportDialog.displayName = 'CommentReportDialog';

export const CommentDeleteDialog = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog> & {
    comment: Comment;
    handleDeleteComment: (e: React.MouseEvent<HTMLElement>) => void;
  }
>(({ comment, handleDeleteComment, ...props }, _ref) => {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose({}, 'backdropClick');
    }
  };
  return (
    <Dialog {...props} ref={_ref}>
      <DialogTitle>{`Delete comment?`}</DialogTitle>
      <DialogContent>
        <Typography>{`ID: ${comment.id}`}</Typography>
        <Typography>&nbsp;</Typography>
        <Typography>{`Are you sure you want to delete this commment?`}</Typography>
        <Typography color="warning">
          This action is <b>irreversible</b>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteComment}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
});

CommentDeleteDialog.displayName = 'CommentDeleteDialog';

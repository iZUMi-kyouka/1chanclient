import theme from '@/app/theme';
import Comment from '@/interfaces/comment';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import React, { forwardRef, useRef } from 'react';
import BareContainer from '../wrapper/bareContainer';

const CommentReportDialog = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Dialog> & {
    comment: Comment,
    handleReport: () => void,
  }
>(({comment, handleReport, ...props}, ref) => {
  const reportRef = useRef<HTMLInputElement | null>(null);

  return (
    <Dialog {...props}>
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
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={handleReport}>Report</Button>
      </DialogActions>
    </Dialog>
  );
});

CommentReportDialog.displayName = 'CommentReportDialog';

export default CommentReportDialog;

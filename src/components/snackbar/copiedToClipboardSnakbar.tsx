'use client';

import {
  closeCopyPasteSnackbar,
  selectOpenCopyPasteSnackbar,
} from '@/store/appState/appStateSlice';
import { Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

/**
 * A global snakcbar to inform user that some text has been successfully
 * copied to the clipboard.
 * @returns
 */
const CopyPasteSnackbar = () => {
  const snackBarOpen = useSelector(selectOpenCopyPasteSnackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      open={snackBarOpen}
      autoHideDuration={5000}
      onClose={() => dispatch(closeCopyPasteSnackbar())}
      message={'Link copied to clipboard!'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    />
  );
};

export default CopyPasteSnackbar;

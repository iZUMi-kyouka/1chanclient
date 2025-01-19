import { closeCopyPasteSnackbar, selectOpenCopyPasteSnackbar } from '@/store/appState/appStateSlice';
import { Snackbar } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

const CopyPasteSnackbar = () => {
  const snackBarOpen = useSelector(selectOpenCopyPasteSnackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      open={snackBarOpen}
      autoHideDuration={5000}
      onClose={() => dispatch(closeCopyPasteSnackbar())}
      message={"Link copied to clipboard!"}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}
    />
  )
}

export default CopyPasteSnackbar;
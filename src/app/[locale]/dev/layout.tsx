import '@mdxeditor/editor/style.css';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Typography variant={'h5'}>Development</Typography>
      {children}
    </>
  );
}

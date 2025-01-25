import DeviceIdHandlerWrapper from '@/components/deviceIdHandlerWrapper';
import AppBarWrapper from '@/components/layout/appBarWrapper';
import Sidebar from '@/components/layout/sidebar';
import LayoutClientWrapper from '@/components/layoutClientWrapper';
import UserDataProviderWrapper from '@/components/user/userDataProviderWrapper';
import { Box, CssBaseline, Paper, Toolbar } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';
import ReduxProvider from './store';
import theme from './theme';

// export const metadata = metadataZ;

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

// export const BASE_API_URL =
//   process.env.HTTPS_ENABLED === 'true'
//     ? process.env.NODE_ENV === 'development'
//       ? 'https://localhost:8080/api/v1'
//       : 'https://onechan.xyz/api/v1'
//     : process.env.NODE_ENV === 'development'
//       ? 'http://localhost:8080/api/v1'
//       : 'http://54.169.160.55/api/v1';

// export const BASE_URL =
//   process.env.HTTPS_ENABLED === 'true'
//     ? process.env.NODE_ENV === 'development'
//       ? 'https://localhost:8080'
//       : 'https://onechan.xyz'
//     : process.env.NODE_ENV === 'development'
//       ? 'http://localhost:8080'
//       : 'http://54.169.160.55';

export const BASE_API_URL = `https://onechan.xyz/api/v1`;
export const BASE_URL = `https://onechan.xyz`

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>1chan</title>
      </head>
      <CssBaseline />

      <body className={roboto.variable}>
        {/* <InitColorSchemeScript attribute="class" /> */}
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <DeviceIdHandlerWrapper />
              <UserDataProviderWrapper />
              <AppBarWrapper />
              <Toolbar sx={{ height: '64px' }} />
              <Paper
                elevation={0}
                sx={{ minHeight: 'calc(100vh - 64px)', borderRadius: '0px' }}
              >
                <Box display='flex'>
                  <Sidebar />
                  {children}
                </Box>
                <LayoutClientWrapper />
              </Paper>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

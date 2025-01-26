import DeviceIdHandlerWrapper from '@/components/deviceIdHandlerWrapper';
import PrimaryAppBar from '@/components/layout/appBar';
import Sidebar from '@/components/layout/sidebar';
import LayoutClientWrapper from '@/components/layoutClientWrapper';
import FetchUserData from '@/components/user/userDataProvider';
import { routing } from '@/i18n/routing';
import { SupportedLanguages } from '@/store/appState/appStateSlice';
import { Box, CssBaseline, Paper, Toolbar } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import ReduxProvider from './store';
import theme from './theme';

// export const metadata = metadataZ;
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
export const BASE_URL = `https://onechan.xyz`;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: SupportedLanguages }>;
}>) {
  const locale = (await params).locale;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <CssBaseline />
      {/* <InitColorSchemeScript attribute="class" /> */}
      <ReduxProvider>
        <NextIntlClientProvider messages={messages}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <DeviceIdHandlerWrapper />
              <FetchUserData locale={locale}/>
              <PrimaryAppBar />
              <Toolbar sx={{ height: '64px' }} />
              <Paper
                elevation={0}
                sx={{ minHeight: 'calc(100vh - 64px)', borderRadius: '0px' }}
              >
                <Box display="flex">
                  <Sidebar />
                  {children}
                </Box>
                <LayoutClientWrapper />
              </Paper>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </ReduxProvider>
    </>
  );
}

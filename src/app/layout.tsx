import type { Metadata } from "next";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Roboto } from 'next/font/google';
import {CssBaseline, Toolbar} from "@mui/material";
import ReduxProvider from "./store";
import FetchUserData from "@/components/userDataProvider";
import PrimaryAppBar from "@/components/appBar";
import HandleDeviceID from "@/components/deviceIdHandler";

const fetcher = (...args: [string, RequestInit?]) => fetch(...args).then(res => res.json);

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto'
});

export const BASE_API_URL = "http://localhost:8080/api/v1";
export const BASE_URL = "http://localhost:8080"

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <html lang="en">
    <head>
    </head>
    <CssBaseline />

    <body className={roboto.variable}>
      <ReduxProvider>
        <HandleDeviceID />
        <FetchUserData />
        <AppRouterCacheProvider>  
          <ThemeProvider theme={theme}>
            <PrimaryAppBar/>
            <Toolbar 
              sx={{
                marginBottom: '24px'
              }}
            />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </ReduxProvider>
    </body>

    </html>
  );
}

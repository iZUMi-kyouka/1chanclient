import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from "react";
import { roboto } from "./[locale]/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html>
      <body className={roboto.variable}>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
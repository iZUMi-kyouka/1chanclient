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
        {children}
      </body>
    </html>
  )
}
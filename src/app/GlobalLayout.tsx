import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { useEffect } from "react";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pageflow",
};

export default function GlobalLayout({ children }: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}

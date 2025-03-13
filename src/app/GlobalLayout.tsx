"use client";

import localFont from "next/font/local";
import React from "react";
import { PageflowGlobalProvider } from "./_provider";
import { STYLES } from "@/global/styles";

const gowunBatang = localFont({
  src: [
    {
      path: "../../public/fonts/GowunBatang-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../public/fonts/GowunBatang-Bold.ttf",
      weight: "700",
      style: "normal"
    },
  ],
});

export const GlobalLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html
      lang="ko"
      className={gowunBatang.className}
    >
      <head>
        <style jsx global>{`
          :root {
            --color-accent: ${STYLES.color.primary};
          }
          
          body, body * {
            font-family: gowunBatang, "gowunBatang Fallback", sans-serif !important;
          }
        `}</style>
      </head>
      <body>
        <PageflowGlobalProvider>
          {children}
        </PageflowGlobalProvider>
      </body>
    </html>
  );
}
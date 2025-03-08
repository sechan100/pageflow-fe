/** @jsxImportSource @emotion/react */
"use client";

import localFont from "next/font/local";
import React from "react";
import { PageflowGlobalProvider } from "./_provider";
import { STYLES } from "@/global/styles";
import { css, Global } from "@emotion/react";

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

const rootStyle = css({
  "--color-accent": STYLES.color.primary,
});

export const GlobalLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko" className={gowunBatang.className} css={rootStyle}>
      <head>
        {/* Emotion의 Global 컴포넌트를 사용하여 전역 스타일 적용 */}
        <Global
          styles={css`
            body, body * {
              font-family: gowunBatang, "gowunBatang Fallback", sans-serif !important;
            }
          `}
        />
      </head>
      <body>
        <PageflowGlobalProvider>
          {children}
        </PageflowGlobalProvider>
      </body>
    </html>
  );
}
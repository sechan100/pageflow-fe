import React from "react";
import { GlobalLayout } from "../GlobalLayout";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GlobalLayout>
      <div className="container">
        {children}
      </div>
    </GlobalLayout>
  );
}

import React from "react";
import { GlobalLayout } from "../GlobalLayout";
import { AppBarWidget, ContainerWithAppBar } from "@/widgets/app-bar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GlobalLayout>
      <AppBarWidget />
      <ContainerWithAppBar>
        {children}
      </ContainerWithAppBar>
    </GlobalLayout>
  );
}

import React from "react";
import { GlobalLayout } from "../GlobalLayout";
import { AppBarWidget, ContainerWithAppBar } from "@/widgets/app-bar";
import { Box } from "@mui/material";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GlobalLayout>
      <AppBarWidget />
      <Box
        sx={{
          my: 14,
        }}
      >
        {children}
      </Box>
    </GlobalLayout>
  );
}

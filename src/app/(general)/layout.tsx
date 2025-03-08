import React from "react";
import { GlobalLayout } from "../GlobalLayout";
import { AppBarWidget } from "@/widgets/app-bar";
import { Container } from "@mui/material";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <GlobalLayout>
      <AppBarWidget />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        {children}
      </Container>
    </GlobalLayout>
  );
}

import { SettingMenu } from '@/pages/settings';
import { Box } from "@mui/material";
import React from "react";


export default function SettingsPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <Box sx={{ display: "flex" }}>
      <SettingMenu />
      {children}
    </Box>
  );
}
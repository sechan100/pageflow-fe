import React from "react";
import { Box } from "@mui/material";
import { SettingMenu } from "./SettingMenu";


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
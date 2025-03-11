import React from "react";
import { GlobalLayout } from "@/app/GlobalLayout";
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
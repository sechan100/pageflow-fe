import { AppBarWidget } from "@/widgets/app-bar";
import { Box } from "@mui/material";
import React from "react";


export const WithAppbarLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <>
      <AppBarWidget />
      <Box
        sx={{
          // my: 14,
        }}
      >
        {children}
      </Box>
    </>
  );
}

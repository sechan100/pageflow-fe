import React from "react";
import { AppBarWidget } from "@/widgets/app-bar";
import { UserWidget } from "@/widgets/user";
import { Box } from "@mui/material";


export const WithAppbarLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <>
      <AppBarWidget
        userWidget={<UserWidget />}
      />
      <Box
        sx={{
          my: 14,
        }}
      >
        {children}
      </Box>
    </>
  );
}

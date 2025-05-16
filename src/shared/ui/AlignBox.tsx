'use client'
import { Box, SxProps } from "@mui/material";
import { useMemo } from "react";



type Props = {
  children: React.ReactNode;
  alignX?: "center" | "left" | "right";
  alignY?: "center" | "top" | "bottom";
  sx?: SxProps;
}
export const AlignBox = ({
  children,
  alignX = "center",
  alignY = "center",
  sx
}: Props) => {
  const justifyContent = useMemo(() => {
    if (alignX === "center") return "center";
    if (alignX === "left") return "start";
    if (alignX === "right") return "end";
    return "center";
  }, [alignX]);

  const alignItems = useMemo(() => {
    if (alignY === "center") return "center";
    if (alignY === "top") return "start";
    if (alignY === "bottom") return "end";
    return "center";
  }, [alignY]);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent,
      alignItems,
      ...sx
    }}>
      {children}
    </Box>
  )
}
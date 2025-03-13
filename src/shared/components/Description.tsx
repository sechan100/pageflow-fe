'use client'

import { SxProps, Theme, Typography } from "@mui/material";



type Props = {
  children: string;

  sx?: SxProps<Theme>;
  color?: string;
  className?: string
}
export const Description = ({
  children,
  color,
  sx,
  className
}: Props) => {

  return (
    <Typography
      variant="body2"
      color={color}
      sx={{
        my: 1,
        opacity: 0.8,
        ...sx,
      }}
    >
      {children}
    </Typography>
  )
}
'use client'
import { SxProps, Typography } from "@mui/material"



type Props = {
  children: React.ReactNode
  sx?: SxProps
}
export const SettingTitle = ({
  children,
  sx
}: Props) => {

  return (
    <Typography
      variant="h6"
      gutterBottom
      sx={sx}
    >
      {children}
    </Typography>
  )
}
'use client'
import { SxProps, Typography } from "@mui/material"



type Props = {
  children: React.ReactNode
  sx?: SxProps
}
export const SettingPageTitle = ({
  children,
  sx
}: Props) => {

  return (
    <Typography
      variant="h4"
      component="h1"
      gutterBottom
      align="center"
      sx={sx}
    >
      {children}
    </Typography>
  )
}
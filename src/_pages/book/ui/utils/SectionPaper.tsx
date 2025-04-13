'use client'
import { Paper, SxProps } from "@mui/material";



type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const SectionPaper = ({
  children,
  sx
}: Props) => {

  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        my: 3,
        borderRadius: 2,
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}
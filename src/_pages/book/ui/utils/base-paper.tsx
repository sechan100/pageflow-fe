'use client'
import { PALLETTE } from "@/global/styles";
import { Box, Divider, Paper, SxProps, Typography } from "@mui/material";



type PaperHeaderProps = {
  title: string;
  sx?: SxProps;
}
export const PaperHeader = ({
  title,
  sx
}: PaperHeaderProps) => {

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5">
          {title}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  )
}


type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const BasePaper = ({
  children,
  sx
}: Props) => {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 3,
        backgroundColor: PALLETTE.background,
        borderRadius: 2,
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}
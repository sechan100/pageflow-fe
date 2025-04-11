'use client'
import { Box, Divider, SxProps, Typography } from "@mui/material";



type Props = {
  title: string;
  sx?: SxProps;
}
export const SectionHeader = ({
  title,
  sx
}: Props) => {

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
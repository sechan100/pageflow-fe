'use client'
import { Grid, SxProps, Typography } from "@mui/material";



type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const Section = ({
  children,
  sx
}: Props) => {

  return (
    <Grid size={{ xs: 6, md: 6 }}>
      {children}
    </Grid>
  )
}

type TitleProps = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const Title = ({
  children,
  sx
}: TitleProps) => {

  return (
    <Typography
      sx={{
        fontWeight: 'bold',
        mb: 2,
      }}
      variant="body2"
      color="textPrimary"
    >
      {children}
    </Typography>
  )
}

export const BookInfo = {
  Section: Section,
  Title: Title
}
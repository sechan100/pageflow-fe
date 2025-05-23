import { PALLETTE } from "@/global/styles";
import { Divider, Paper, SxProps } from "@mui/material";


type ReviewBoxProps = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const ReviewBox = ({ children, sx }: ReviewBoxProps) => {
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          my: 1,
          backgroundColor: PALLETTE.background,
          borderRadius: 2,
          ...sx,
        }}
      >
        {children}
      </Paper>
      <Divider />
    </>
  )
}
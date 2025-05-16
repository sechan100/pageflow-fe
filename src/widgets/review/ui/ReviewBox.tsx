import { STYLES } from "@/global/styles";
import { Paper, SxProps } from "@mui/material";


type ReviewBoxProps = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const ReviewBox = ({ children, sx }: ReviewBoxProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        backgroundColor: STYLES.color.background,
        borderRadius: 2,
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}
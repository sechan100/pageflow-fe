import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Typography } from "@mui/material";

export const BarLogo = () => {
  const { router } = useNextRouter();

  return (
    <Typography
      variant="h6"
      sx={{
        color: 'black',
        cursor: 'pointer',
      }}
      onClick={() => router.push('/')}
    >
      Pageflow
    </Typography>
  );
}
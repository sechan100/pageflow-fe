'use client';

import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Typography, TypographyPropsVariantOverrides } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { OverridableStringUnion } from "@mui/types";


type Props = {
  variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
}
export const PageflowLogo = ({
  variant = 'h3'
}: Props) => {
  const { router } = useNextRouter();

  return (
    <Typography
      variant={variant}
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => router.push('/')}
    >
      Pageflow
    </Typography>
  );
}
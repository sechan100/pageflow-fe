"use client";

import { PennameField } from '@/features/user';
import { Field } from "@/shared/field";
import { Typography, Box, SxProps } from "@mui/material";

type Props = {
  penname: Field;
  onChange: (field: Field) => void;
  sx?: SxProps;
};
export const PennameSetting = ({
  penname,
  onChange,
  sx,
}: Props) => {

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          필명
        </Typography>
        <PennameField
          penname={penname}
          onChange={onChange}
        />
      </Box>
    </>
  );
};

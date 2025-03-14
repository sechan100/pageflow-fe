"use client";

import { PennameField } from '@/features/user';
import { Field } from "@/shared/field";
import { Typography, Box, SxProps } from "@mui/material";
import { SettingTitle } from '../SettingTitle';

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
        <SettingTitle>필명</SettingTitle>
        <PennameField
          penname={penname}
          onChange={onChange}
        />
      </Box>
    </>
  );
};

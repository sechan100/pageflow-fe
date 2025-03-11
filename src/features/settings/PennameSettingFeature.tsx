"use client";

import { useApplicationProperties } from "@/global/properties";
import { InputAdornment, TextField, Typography, Box } from "@mui/material";
import { Pencil } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  // penname
  penname: string;
  onChange: (penname: string) => void;

  // error
  error: string | null;
  onErrorChange: (error: string | null) => void;

  className?: string;
};
export const PennameSettingFeature = ({
  penname,
  onChange,
  error,
  onErrorChange,
  className,
}: Props) => {
  const {
    serverProperties: {
      user: {
        pennameMinLength,
        pennameMaxLength,
        pennameRegex,
        pennameRegexMessage,
      },
    },
  } = useApplicationProperties();

  const handlePennameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const penname = e.target.value;
    onChange(penname);

    let newError: string | null = null;
    if (pennameMinLength > penname.length) {
      newError = `필명은 ${pennameMinLength}자 이상이어야 합니다.`;

    } else if (pennameMaxLength < penname.length) {
      newError = `필명은 ${pennameMaxLength}자 이하여야 합니다.`;

    } else if (!new RegExp(pennameRegex).test(penname)) {
      newError = pennameRegexMessage;

    } else {
      newError = null;
    }
    onErrorChange(newError);
  }, [onChange, penname]);

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          필명
        </Typography>
        <TextField
          fullWidth
          name="penname"
          value={penname}
          onChange={handlePennameChange}
          error={!!error}
          helperText={error}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Pencil />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </>
  );
};

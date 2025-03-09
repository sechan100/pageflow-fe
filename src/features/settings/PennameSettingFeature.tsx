"use client";

import { useApplicationProperties } from "@/global/properties";
import { InputAdornment, TextField, Typography, Box } from "@mui/material";
import { Pencil } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  penname: string;
  onPennameChange: (penname: string) => void;
  className?: string;
};
export const PennameSettingFeature = ({
  penname,
  onPennameChange,
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
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handlePennameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const penname = e.target.value;
    onPennameChange(penname);
    if (pennameMinLength > penname.length) {
      setFieldError(`필명은 ${pennameMinLength}자 이상이어야 합니다.`);
      return;
    }
    if (pennameMaxLength < penname.length) {
      setFieldError(`필명은 ${pennameMaxLength}자 이하여야 합니다.`);
      return;
    }
    if (!new RegExp(pennameRegex).test(penname)) {
      setFieldError(pennameRegexMessage);
      return;
    }
    setFieldError(null);
  }, [onPennameChange, penname]);

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
          error={!!fieldError}
          helperText={fieldError}
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

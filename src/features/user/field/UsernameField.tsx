'use client'

import { Field } from "@/shared/field";
import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, SxProps, TextField } from "@mui/material"
import { useCallback } from "react";



type Props = {
  username: Field;
  onChange: (field: Field) => void;
  lable?: string;
  fieldName?: string;
  sx?: SxProps;
}
export const UsernameField = ({
  username,
  onChange,
  lable = '아이디',
  fieldName = 'username',
  sx
}: Props) => {

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;

    // validation
    const newError = null;
    onChange({ value: newUsername, error: newError });
  }, [onChange]);

  return (
    <>
      <TextField
        name={fieldName}
        label={lable}
        type="text"
        variant="outlined"
        value={username.value}
        onChange={handleUsernameChange}
        error={!!username.error}
        helperText={username.error}
        required
        sx={sx}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            )
          }
        }}
      />
    </>
  )
}
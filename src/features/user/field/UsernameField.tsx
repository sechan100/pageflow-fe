'use client'

import { Field } from "@/shared/field";
import { AccountCircle } from "@mui/icons-material";
import { InputAdornment, SxProps, TextField } from "@mui/material"
import { useCallback } from "react";
import { fieldMarginY } from "../../../shared/components/field-margin-y";
import { useApplicationProperties } from "@/global/properties";



type Props = {
  username: Field;
  onChange: (field: Field) => void;

  // default: false
  disableValidator?: boolean;
  disableErrorText?: boolean;
  lable?: string;
  fieldName?: string;
  sx?: SxProps;
}
export const UsernameField = ({
  username,
  onChange,
  disableValidator,
  disableErrorText,
  lable = '아이디',
  fieldName = 'username',
  sx
}: Props) => {
  const {
    user: {
      usernameMinLength,
      usernameMaxLength,
      usernameRegex,
      usernameRegexMessage,
    }
  } = useApplicationProperties();

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    if (disableValidator) {
      onChange({ value: newUsername, error: null });
      return;
    }

    let newError: string | null = null;
    if (usernameMinLength > newUsername.length) {
      newError = `아이디는 ${usernameMinLength}자 이상이어야 합니다.`;

    } else if (usernameMaxLength < newUsername.length) {
      newError = `아이디는 ${usernameMaxLength}자 이하여야 합니다.`;

    } else if (!new RegExp(usernameRegex).test(newUsername)) {
      newError = usernameRegexMessage;

    } else {
      newError = null;
    }
    onChange({ value: newUsername, error: newError });
  }, [disableValidator, onChange, usernameMaxLength, usernameMinLength, usernameRegex, usernameRegexMessage]);

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
        helperText={!disableErrorText ? username.error : null}
        required
        sx={{
          my: fieldMarginY,
          ...sx
        }}
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
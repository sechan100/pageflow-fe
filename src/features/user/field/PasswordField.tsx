'use client'

import { useApplicationProperties } from "@/global/properties"
import { IconButton, InputAdornment, SxProps, TextField } from "@mui/material"
import { useCallback, useState } from "react"
import { LockIcon } from "lucide-react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Field } from "@/shared/field"
import { fieldMarginY } from "../../../shared/components/field-margin-y"



type Props = {
  password: Field;
  onChange: (field: Field) => void;

  // default: false
  disableValidator?: boolean;
  customValidaotr?: (password: string, defaultValidator: (password: string) => string | null) => string | null,

  /**
   * default: '비밀번호'
   */
  label?: string,

  fieldName?: string,

  sx?: SxProps,
}
export const PasswordField = ({
  password,
  onChange,
  disableValidator,
  customValidaotr,
  label = '비밀번호',
  fieldName = 'password',
  sx,
}: Props) => {
  const {
    user: {
      passwordMinLength,
      passwordMaxLength,
      passwordRegex,
      passwordRegexMessage
    }
  } = useApplicationProperties();

  const [showPassword, setShowPassword] = useState(false);


  const handleTogglePassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);


  const defaultValidator = useCallback((password: string) => {
    if (password.length < passwordMinLength) {
      return `비밀번호는 ${passwordMinLength}자 이상이어야 합니다.`;
    }
    if (password.length > passwordMaxLength) {
      return `비밀번호는 ${passwordMaxLength}자 이하여야 합니다.`;
    }
    if (!new RegExp(passwordRegex).test(password)) {
      return passwordRegexMessage;
    }
    return null;
  }, [passwordMinLength, passwordMaxLength, passwordRegex, passwordRegexMessage]);


  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    if (disableValidator) {
      onChange({ value: newPassword, error: null });
      return;
    }

    const newError = customValidaotr ? customValidaotr(newPassword, defaultValidator) : defaultValidator(newPassword);
    onChange({
      value: newPassword,
      error: newError
    })
  }, [disableValidator, customValidaotr, defaultValidator, onChange]);


  return (
    <TextField
      name={fieldName}
      label={label}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      value={password.value}
      onChange={handlePasswordChange}
      error={!!password.error}
      helperText={password.error}
      sx={{
        my: fieldMarginY,
        ...sx
      }}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                tabIndex={-1}
                edge="end"
                onClick={handleTogglePassword}
              >
                {showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }
      }}
    />
  )
}
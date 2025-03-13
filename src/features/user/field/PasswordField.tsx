'use client'

import { useApplicationProperties } from "@/global/properties"
import { IconButton, InputAdornment, SxProps, TextField } from "@mui/material"
import { useCallback, useState } from "react"
import { LockIcon } from "lucide-react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Field } from "@/shared/field"



type Props = {
  password: Field;
  onChange: (field: Field) => void;

  /**
   * 비밀번호 유효성 검사
   * default: 필요한 기본 비밀번호 유효성 검사를 진행한다.
   */
  validatePassword?: (password: string, defaultValidator: (password: string) => string | null) => string | null,

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
  validatePassword,
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


  const validatePasswordWithDefaultRule = useCallback((password: string) => {
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

    const newError = validatePassword ? validatePassword(newPassword, validatePasswordWithDefaultRule) : validatePasswordWithDefaultRule(newPassword);
    onChange({
      value: newPassword,
      error: newError
    })
  }, [onChange, validatePassword, validatePasswordWithDefaultRule]);


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
      sx={sx}
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
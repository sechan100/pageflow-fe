'use client'

import { useApplicationProperties } from "@/global/properties"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { useCallback, useState } from "react"
import { Field } from "../hooks/use-field-state"
import { LockIcon } from "lucide-react"
import { Visibility, VisibilityOff } from "@mui/icons-material"



type Props = {
  passwordField: Field<string>,

  /**
   * 비밀번호 상태 변경
   */
  onPasswordFieldChange: (field: Field<string>) => void

  /**
   * 비밀번호 유효성 검사
   * default: 필요한 기본 비밀번호 유효성 검사를 진행한다.
   */
  validatePassword?: (password: string, defaultValidator: (password: string) => string | null) => string | null,

  /**
   * default: '비밀번호'
   */
  label?: string,

  className?: string,
}
export const PasswordField = ({
  passwordField,
  onPasswordFieldChange,
  validatePassword,
  label = '비밀번호',
  className,
}: Props) => {
  const { serverProperties: {
    user: {
      passwordMinLength,
      passwordMaxLength,
      passwordRegex,
      passwordRegexMessage
    }
  } } = useApplicationProperties();

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
    onPasswordFieldChange({
      ...passwordField,
      value: newPassword,
      error: validatePassword ? validatePassword(newPassword, validatePasswordWithDefaultRule) : validatePasswordWithDefaultRule(newPassword)
    });
  }, [passwordField, onPasswordFieldChange, validatePassword]);


  return (
    <TextField
      fullWidth
      name={passwordField.field}
      label={label}
      type={showPassword ? "text" : "password"}
      value={passwordField.value}
      onChange={handlePasswordChange}
      error={!!passwordField.error}
      helperText={passwordField.error}
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
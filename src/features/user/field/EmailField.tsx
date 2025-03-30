'use client'

import { fieldMarginY } from "@/shared/components/field-margin-y"
import { Field } from "@/shared/field"
import { InputAdornment, SxProps, TextField, Theme } from "@mui/material"
import { Mail } from "lucide-react"
import { useCallback } from "react"



type Props = {
  email: Field;
  onChange: (field: Field) => void
  fieldName?: string
  lable?: string
  className?: string
  sx?: SxProps<Theme>
}
export const EmailField = ({
  email,
  onChange,
  fieldName = 'email',
  lable = '이메일',
  sx,
  className
}: Props) => {

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    const newError = isEmail ? null : "유효한 이메일 형식이 아닙니다.";
    onChange({
      value: newEmail,
      error: newError
    });
  }, [onChange]);

  return (
    <TextField
      name={fieldName}
      label={lable}
      type="email"
      variant="outlined"
      value={email.value}
      onChange={handleEmailChange}
      error={!!email.error}
      helperText={email.error}
      sx={{
        my: fieldMarginY,
        ...sx
      }}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Mail />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
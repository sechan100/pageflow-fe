'use client'

import { passwordMatchRequest } from "@/entities/user"
import { useApplicationProperties } from "@/global/properties"
import { PasswordField } from "@/shared/components/PasswordField"
import { Field } from "@/shared/field-validation"
import { useNotification } from "@/shared/notification"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Dialog, Box, DialogTitle, Typography, DialogContent, DialogContentText, TextField, InputAdornment, IconButton, Button, Divider, DialogActions, Stack, Paper } from "@mui/material"
import { LockIcon } from "lucide-react"
import { useCallback, useState } from "react"


type PasswordChangeModalProps = {
  open: boolean
  handleClose: () => void
  className?: string
}
export const PasswordChangeModalFeature = ({
  open,
  handleClose,
  className
}: PasswordChangeModalProps) => {
  const notification = useNotification()

  const [currentPasswordField, setCurrentPasswordField] = useState<Field<string>>({
    field: "password",
    value: "",
    error: null,
  });
  const [newPasswordField, setNewPasswordField] = useState<Field<string>>({
    field: "newPassword",
    value: "",
    error: null,
  });
  const [confirmPasswordField, setConfirmPasswordField] = useState<Field<string>>({
    field: "confirmPassword",
    value: "",
    error: null,
  });


  const validateCurrentPassword = useCallback((newPassword: string) => {
    if (newPassword.length < 1) {
      return "비밀번호를 입력해주세요."
    } else {
      return null
    }
  }, [currentPasswordField])


  const validateNewPassword = useCallback((newPassword: string, defaultValidator: (password: string) => string | null) => {
    const defaultValidation = defaultValidator(newPassword);
    if (defaultValidation) {
      return defaultValidation;
    }
    if (newPassword === currentPasswordField.value) {
      return "현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다."
    } else {
      return null
    }
  }, [newPasswordField])


  const validateConfirmPassword = useCallback((confirmPassword: string) => {
    if (confirmPassword !== newPasswordField.value) {
      return "비밀번호가 일치하지 않습니다."
    } else {
      return null
    }
  }, [confirmPasswordField])


  const clearPasswords = useCallback(() => {
    setCurrentPasswordField({
      ...currentPasswordField,
      value: ""
    })
    setNewPasswordField({
      ...newPasswordField,
      value: ""
    })
    setConfirmPasswordField({
      ...confirmPasswordField,
      value: ""
    })
  }, [currentPasswordField, newPasswordField, confirmPasswordField])


  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (currentPasswordField.error || newPasswordField.error || confirmPasswordField.error) {
      return
    }
    console.log("비밀번호 변경 요청")
    const success = true;
    if (success) {
      notification.success("비밀번호가 정상적으로 변경되었습니다.")
      clearPasswords();
      handleClose();
    } else {
      setCurrentPasswordField({
        ...currentPasswordField,
        error: "비밀번호가 일치하지 않습니다."
      })
    }
  }, [currentPasswordField, newPasswordField, confirmPasswordField])


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" align="center" fontWeight="bold">
          비밀번호 변경
        </Typography>
      </DialogTitle>

      {/* 비밀번호 변경 */}
      <Paper sx={{ p: 5 }}>
        <Stack spacing={2}>
          <PasswordField
            passwordField={currentPasswordField}
            onPasswordFieldChange={setCurrentPasswordField}
            label="현재 비밀번호"
            validatePassword={validateCurrentPassword}
          />

          <PasswordField
            passwordField={newPasswordField}
            onPasswordFieldChange={setNewPasswordField}
            validatePassword={validateNewPassword}
            label="새 비밀번호"
          />

          <PasswordField
            passwordField={confirmPasswordField}
            onPasswordFieldChange={setConfirmPasswordField}
            label="새 비밀번호 확인"
            validatePassword={validateConfirmPassword}
          />
        </Stack>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          변경하기
        </Button>
      </Paper>
    </Dialog>
  )
}
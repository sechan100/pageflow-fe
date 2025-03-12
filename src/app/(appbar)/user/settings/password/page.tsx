'use client'

import { changePasswordRequest } from "@/entities/user/password"
import { PasswordField } from "@/shared/components/PasswordField"
import { FieldErrorDispatcher } from "@/shared/field"
import { Field } from "@/shared/hooks/use-field-state"
import { useNotification } from "@/shared/notification"
import { Button, Container, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"


type PasswordChangePageProps = {
  className?: string
}
export default function PasswordChangePage({
  className
}: PasswordChangePageProps) {
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


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentPasswordField.error || newPasswordField.error || confirmPasswordField.error) {
      return
    }

    const result = await changePasswordRequest({
      currentPassword: currentPasswordField.value,
      newPassword: newPasswordField.value
    });
    switch (result.code) {
      case "success":
        notification.success("비밀번호가 정상적으로 변경되었습니다.")
        clearPasswords();
        break;
      case "field-error":
        new FieldErrorDispatcher(result.fieldErrors)
          .on("currentPassword", (message) => setCurrentPasswordField({
            ...currentPasswordField,
            error: message
          }))
          .on("newPassword", (message) => setNewPasswordField({
            ...newPasswordField,
            error: message
          }))
          .dispatch();
        break;
    }
  }, [currentPasswordField, newPasswordField, confirmPasswordField])


  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        비밀번호 변경
      </Typography>

      {/* 비밀번호 변경 */}
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
    </Container>
  )
}
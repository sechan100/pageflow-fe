'use client'

import { UserApi } from "@/entities/user"
import { PasswordField } from "@/features/user"
import { Field, FieldErrorDispatcher } from "@/shared/field"
import { useNotification } from "@/shared/notification"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"


const fieldNames = {
  current: "currentPassword",
  new: "newPassword",
  confirm: "confirmPassword"
}


export default function PasswordChangePage() {
  const notification = useNotification()

  // [[ fields
  const [currentPasswordField, setCurrentPasswordField] = useState<Field>({ value: "", error: null, });
  const [newPasswordField, setNewPasswordField] = useState<Field>({ value: "", error: null, });
  const [confirmPasswordField, setConfirmPasswordField] = useState<Field>({ value: "", error: null, });

  const isAllFieldValid = useMemo(() => {
    return !currentPasswordField.error && !newPasswordField.error && !confirmPasswordField.error;
  }, [currentPasswordField, newPasswordField, confirmPasswordField])

  const isAllFieldFilled = useMemo(() => {
    return !!currentPasswordField.value && !!newPasswordField.value && !!confirmPasswordField.value;
  }, [currentPasswordField.value, newPasswordField.value, confirmPasswordField.value])
  // ]]


  // [[ validators
  const validateCurrentPassword = useCallback((newPassword: string) => {
    if (newPassword.length < 1) {
      return "비밀번호를 입력해주세요."
    } else {
      return null
    }
  }, [])

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
  }, [currentPasswordField.value])

  const validateConfirmPassword = useCallback((confirmPassword: string) => {
    if (confirmPassword !== newPasswordField.value) {
      return "비밀번호가 일치하지 않습니다."
    } else {
      return null
    }
  }, [newPasswordField.value])
  // ]]


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
    if (!(isAllFieldValid && isAllFieldFilled)) throw new Error("모든 필드가 유효하지 않습니다.");
    e.preventDefault();

    const result = await UserApi.changePassword({
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
          .set(fieldNames.current, (message) => setCurrentPasswordField({
            ...currentPasswordField,
            error: message
          }))
          .set(fieldNames.new, (message) => setNewPasswordField({
            ...newPasswordField,
            error: message
          }))
          .dispatch();
        break;
    }
  }, [isAllFieldValid, isAllFieldFilled, currentPasswordField, newPasswordField, notification, clearPasswords])


  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        비밀번호 변경
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        {/* 비밀번호 변경 */}
        <Stack spacing={2}>
          <PasswordField
            password={currentPasswordField}
            onChange={setCurrentPasswordField}
            label="현재 비밀번호"
            fieldName={fieldNames.current}
            customValidaotr={validateCurrentPassword}
          />

          <PasswordField
            password={newPasswordField}
            onChange={setNewPasswordField}
            customValidaotr={validateNewPassword}
            label="새 비밀번호"
            fieldName={fieldNames.new}
          />

          <PasswordField
            password={confirmPasswordField}
            onChange={setConfirmPasswordField}
            label="새 비밀번호 확인"
            fieldName={fieldNames.confirm}
            customValidaotr={validateConfirmPassword}
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!(isAllFieldValid && isAllFieldFilled)}
        >
          변경하기
        </Button>
      </Box>
    </Container>
  )
}
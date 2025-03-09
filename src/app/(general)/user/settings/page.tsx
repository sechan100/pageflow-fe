"use client";
import React, { useState, useRef, useMemo } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Stack,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  Grid,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { Session, SessionUser, useSessionQuery } from "@/entities/user";
import { PennameSettingFeature } from "@/features/settings";
import { EmailSettingFeature } from "@/features/settings/EmailSettingFeature";

// 기본 사용자 정보 타입
interface UserInfo {
  penname: string;
  email: string;
  isEmailVerified: boolean;
  profileImage: string | null;
}

// 변경된 데이터 타입
interface FormData {
  penname: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  profileImage: File | null;
}

export default function SettingsPage() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.data) {
    return <div>Loading...</div>;
  }

  return <Settings session={sessionQuery.data} />;
}

type Props = {
  session: Session;
};
const Settings = ({ session }: Props) => {
  const queriedUserData = session.user;

  // 폼 상태 관리
  const [formData, setFormData] = useState<FormData>({
    penname: queriedUserData.penname,
    email: queriedUserData.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: null,
  });

  // UI 상태 관리
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [emailChanged, setEmailChanged] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    queriedUserData.profileImageUrl
  );

  // 폼 유효성 상태
  const [errors, setErrors] = useState({
    penname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 각 필드별 유효성 검사
    validateField(name, value);
  };

  // 필드별 유효성 검사
  const validateField = (fieldName: string, value: string) => {
    let newErrors = { ...errors };

    switch (fieldName) {
      case "newPassword":
        newErrors.newPassword = value.length < 8 ? "비밀번호는 최소 8자 이상이어야 합니다." : "";
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        } else if (formData.confirmPassword) {
          newErrors.confirmPassword = "";
        }
        break;
      case "confirmPassword":
        newErrors.confirmPassword = formData.newPassword && value !== formData.newPassword ? "비밀번호가 일치하지 않습니다." : "";
        break;
      case "currentPassword":
        newErrors.currentPassword = value.length < 1 ? "현재 비밀번호를 입력해주세요." : "";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // 비밀번호 토글
  const handleTogglePassword = (field: "current" | "new" | "confirm") => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    else if (field === "new") setShowNewPassword(!showNewPassword);
    else setShowConfirmPassword(!showConfirmPassword);
  };

  // 이미지 선택 창 오픈
  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
      });

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    let isValid = true;
    let newErrors = { ...errors };

    // 필명 검사
    if (!formData.penname) {
      newErrors.penname = "필명은 필수 입력 항목입니다.";
      isValid = false;
    }

    // 이메일 검사
    if (!formData.email) {
      newErrors.email = "이메일은 필수 입력 항목입니다.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다.";
      isValid = false;
    }

    // 비밀번호 변경을 시도하는 경우 추가 검사
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
        isValid = false;
      }

      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "새 비밀번호는 최소 8자 이상이어야 합니다.";
        isValid = false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      // 여기서 API 호출하여 사용자 정보 업데이트
      // const response = await api.updateUserProfile(formData);

      // 이미지 업로드 처리 (필요한 경우)
      if (formData.profileImage) {
        // 이미지 업로드 API 호출
        // const imageUploadResponse = await api.uploadProfileImage(formData.profileImage);
        // const imageUrl = imageUploadResponse.data.imageUrl;

        // 여기서는 간단하게 미리보기 URL을 사용
        //   setUserData({
        //     ...userData,
        //     penname: formData.penname,
        //     email: formData.email,
        //     isEmailVerified: emailChanged ? false : userData.isEmailVerified,
        //     profileImage: previewImage,
        //   });
        // } else {
        //   // 이미지 변경이 없는 경우
        //   setUserData({
        //     ...userData,
        //     penname: formData.penname,
        //     email: formData.email,
        //     isEmailVerified: emailChanged ? false : userData.isEmailVerified,
        //   });
      }

      // 비밀번호 필드 초기화
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSnackbar({
        open: true,
        message: "프로필이 성공적으로 업데이트되었습니다.",
        severity: "success",
      });

      // 이메일이 변경된 경우 인증 요청 필요성 알림
      if (emailChanged) {
        setSnackbar({
          open: true,
          message: "이메일이 변경되었습니다. 새 이메일을 인증해주세요.",
          severity: "info",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "프로필 업데이트에 실패했습니다.",
        severity: "error",
      });
    }
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        사용자 설정
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* 프로필 이미지 섹션 */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                프로필 이미지
              </Typography>
              <Avatar
                src={previewImage || undefined}
                sx={{ width: 150, height: 150, mb: 2, mx: "auto" }}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={handleImageButtonClick}
                fullWidth
              >
                이미지 변경
              </Button>
            </Box>
          </Grid>

          {/* 사용자 정보 섹션 */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>

              {/* 필명 변경 */}
              <PennameSettingFeature
                penname={formData.penname}
                onPennameChange={(penname) =>
                  setFormData({ ...formData, penname })
                }
              />

              <Divider />

              <EmailSettingFeature
                email={formData.email}
                originalEmail={queriedUserData.email}
                onEmailChange={(email) => {
                  setFormData({ ...formData, email })
                }}
                isEmailVerified={queriedUserData.isEmailVerified}
              />

              <Divider />

              {/* 비밀번호 변경 */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  비밀번호 변경
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    name="currentPassword"
                    label="현재 비밀번호"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => handleTogglePassword("current")}
                          >
                            {showCurrentPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    name="newPassword"
                    label="새 비밀번호"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => handleTogglePassword("new")}
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="새 비밀번호 확인"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => handleTogglePassword("confirm")}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* 저장 버튼 */}
          <Grid item xs={12}>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                size="large"
              >
                설정 저장
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            snackbar.severity === "success"
              ? "success"
              : snackbar.severity === "error"
                ? "error"
                : "info"
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

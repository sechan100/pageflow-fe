"use client";
import { Session, SESSION_QUERY_KEY, useSessionQuery } from "@/entities/user";
import { updateProfileRequest } from "@/entities/user/update-profile";
import { PennameSettingFeature } from "@/features/settings";
import { EmailSettingFeature } from "@/features/settings/EmailSettingFeature";
import { useFieldState } from "@/shared/hooks/use-field-state";
import { useNotification } from "@/shared/notification";
import {
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  Stack,
  Typography
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useRef, useState } from "react";


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
  const userData = session.user;
  const notification = useNotification();
  const queryClient = useQueryClient();

  // email
  const [email, setEmail] = useState(userData.email);
  const [emailError, setEmailError] = useState<string | null>(null);

  // penname
  const [penname, setPenname] = useState(userData.penname);
  const [pennameError, setPennameError] = useState<string | null>(null);

  // profileImageFile
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageFileError, setProfileImageFileError] = useState<string | null>(null);

  // profile image preview
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(userData.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const isAllFieldValid = useMemo(() => {
    return !emailError && !pennameError && !profileImageFileError;
  }, [emailError, pennameError, profileImageFileError]);


  const isAnyFieldChanged = useMemo(() => {
    const isEmailChanged = email !== userData.email;
    const isPennameChanged = penname !== userData.penname;
    const isProfileImageChanged = profileImageFile !== null;
    return isEmailChanged || isPennameChanged || isProfileImageChanged;
  }, [email, penname, profileImageFile, userData]);


  const handleImageButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfileImageFile(file);
    }
  }, []);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllFieldValid) {
      throw new Error("form data에 유효하지 않은 필드가 있습니다.");
    }

    const res = await updateProfileRequest({
      email,
      penname,
      profileImage: profileImageFile,
      toDefaultProfileImage: false,
    })
    if (res.isSuccess()) {
      setProfileImageFile(null);
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
      notification.success("프로필이 업데이트되었습니다.");
    } else {
      notification.error("프로필 업데이트에 실패했습니다.");
    }
  }, [email, penname, profileImageFile, isAllFieldValid, notification]);


  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        프로필 설정
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={4}>
          {/* 프로필 이미지 섹션 */}
          <Grid2
            size={{
              xs: 12,
              md: 3,
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                프로필 이미지
              </Typography>
              <Avatar
                src={profileImagePreview || undefined}
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
          </Grid2>

          {/* 사용자 정보 섹션 */}
          <Grid2
            size={{
              xs: 12,
              md: 9,
            }}
          >
            <Stack spacing={5}>
              <PennameSettingFeature
                penname={penname}
                onChange={setPenname}
                error={pennameError}
                onErrorChange={setPennameError}
              />
              <EmailSettingFeature
                email={email}
                onChange={setEmail}
                isEmailVerified={userData.isEmailVerified}
                originalEmail={userData.email}
                error={emailError}
                onErrorChange={setEmailError}
              />
            </Stack>
          </Grid2>

          {/* 저장 버튼 */}
          <Grid2
            size={{
              xs: 12,
            }}
          >
            <Divider />
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                size="large"
                disabled={!(isAnyFieldChanged && isAllFieldValid)}
              >
                설정 저장
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </form>
    </Container >
  );
};
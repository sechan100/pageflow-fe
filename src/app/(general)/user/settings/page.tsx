"use client";
import { Session, useSessionQuery } from "@/entities/user";
import { PennameSettingFeature } from "@/features/settings";
import { EmailSettingFeature } from "@/features/settings/EmailSettingFeature";
import { PasswordChangeModalFeature } from "@/features/settings/PasswordChangeModalFeature";
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
  Grid,
  Stack,
  Typography
} from "@mui/material";
import React, { useCallback, useMemo, useRef, useState } from "react";


export default function SettingsPage() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.data) {
    return <div>Loading...</div>;
  }

  return <Settings session={sessionQuery.data} />;
}

interface FormData {
  penname: string;
  email: string;
  profileImage: File | null;
}


type Props = {
  session: Session;
};
const Settings = ({ session }: Props) => {
  const queriedUserData = session.user;
  const notification = useNotification();

  const [formData, setFormData] = useState<FormData>({
    penname: queriedUserData.penname,
    email: queriedUserData.email,
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(queriedUserData.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{
    penname: boolean;
    email: boolean;
    profileImage: boolean;
  }>({
    penname: false,
    email: false,
    profileImage: false,
  });
  const isAllFieldValid = useMemo(() => !Object.values(errors).some((error) => error), [errors]);


  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [formData]);


  /**
   * 폼 제출
   * @returns 
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllFieldValid) {
      throw new Error("form data에 유효하지 않은 필드가 있습니다.");
    }

    console.log("프로필 업데이트 요청!", formData);
    const isRequestSuccess = true;
    if (isRequestSuccess) {
      notification.success("프로필이 업데이트되었습니다.");
    } else {
      notification.error("프로필 업데이트에 실패했습니다.");
    }
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
                onEmailValidChange={(isValid) => setErrors({ ...errors, email: !isValid })}
                onEmailChange={(email) => setFormData({ ...formData, email })}
                isEmailVerified={queriedUserData.isEmailVerified}
              />
              <Divider />
              <PasswordChangeSetting />
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
    </Container>
  );
};



type PasswordChangeSettingProps = {
  className?: string
}
const PasswordChangeSetting = ({
  className
}: PasswordChangeSettingProps) => {
  const [passwordChangeModalOpen, setPasswordChangeModalOpen] = useState(false);


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" gutterBottom>
        비밀번호 변경
      </Typography>
      <Button
        variant="outlined"
        onClick={() => setPasswordChangeModalOpen(true)}
      >
        비밀번호 변경
      </Button>
      <PasswordChangeModalFeature
        open={passwordChangeModalOpen}
        handleClose={() => setPasswordChangeModalOpen(false)}
      />
    </Box>
  )
}
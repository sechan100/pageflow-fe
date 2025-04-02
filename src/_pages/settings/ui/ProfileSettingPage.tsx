"use client";
import { Session, SESSION_QUERY_KEY } from "@/entities/user";
import { Field } from "@/shared/field";
import { useNotification } from "@/shared/ui/notification";
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
import { updateProfileApi } from "../api/update-profile";
import { PennameSetting } from "./PennameSetting";
import { SettingPageTitle } from "./SettingPageTitle";


type Props = {
  session: Session;
};
export const ProfileSettingsPage = ({ session }: Props) => {
  const userData = session.user;
  const notification = useNotification();
  const queryClient = useQueryClient();

  // [[ fields
  const [penname, setPenname] = useState<Field>({
    value: userData.penname,
    error: null,
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageFileError, setProfileImageFileError] = useState<string | null>(null);
  // ]]

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(userData.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAllFieldValid = useMemo(() => {
    return !penname.error && !profileImageFileError;
  }, [penname.error, profileImageFileError]);


  const isAnyFieldChanged = useMemo(() => {
    const isPennameChanged = penname.value !== userData.penname;
    const isProfileImageChanged = profileImageFile !== null;
    return isPennameChanged || isProfileImageChanged;
  }, [penname, profileImageFile, userData]);


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

    const res = await updateProfileApi({
      penname: penname.value,
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
  }, [isAllFieldValid, penname, profileImageFile, queryClient, notification]);


  return (
    <Container maxWidth="md">
      <SettingPageTitle>프로필 설정</SettingPageTitle>

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
              <PennameSetting
                penname={penname}
                onChange={setPenname}
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
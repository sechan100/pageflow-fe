"use client";
import { Session, SESSION_QUERY_KEY, useSessionQuery } from "@/entities/user";
import { UserApi } from '@/entities/user';
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
import { Field } from "@/shared/field";
import { EmailSetting } from "./EmailSetting";
import { PasswordSetting } from "./PasswordSetting";
import { SettingPageTitle } from "../SettingPageTitle";


export default function AccountSettingsPage() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.data) {
    return <div>Loading...</div>;
  }

  return <AccountSettings session={sessionQuery.data} />;
}


type Props = {
  session: Session;
};
const AccountSettings = ({ session }: Props) => {
  const userData = session.user;
  const notification = useNotification();
  const queryClient = useQueryClient();

  return (
    <Container maxWidth="md">
      <SettingPageTitle>계정 설정</SettingPageTitle>
      <Stack spacing={5}>
        <EmailSetting
          isEmailVerified={userData.isEmailVerified}
          email={userData.email}
        />
        <Divider />
        <PasswordSetting />
      </Stack>
    </Container >
  );
};
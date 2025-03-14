'use client';
import { Session } from "@/entities/user";
import { useNotification } from "@/shared/notification";
import {
  Container,
  Divider,
  Stack
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { EmailSetting } from "./EmailSetting";
import { PasswordSetting } from "./PasswordSetting";
import { SettingPageTitle } from "./SettingPageTitle";

type Props = {
  session: Session;
};
export const AccountSettingsPage = ({ session }: Props) => {
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
"use client";

import { UserApi } from '@/entities/user';
import { EmailField } from '@/features/user';
import { Field } from '@/shared/field';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SxProps,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { SettingTitle } from '../SettingTitle';
import { Description } from '@/shared/components/Description';


type EmailVerifiedState = "unverified" | "verification-email-sended" | "verified"

const VERIFICAITON_EMAIL_SEND_INTERVAL = 30;

type EmailVerificationButtonProps = {
  email: Field;
  originalEmail: string;
  isEmailVerified: boolean
  onErrorChange: (error: string) => void;
}
const EmailVerificationButton = ({
  email,
  originalEmail,
  isEmailVerified,
  onErrorChange,
}: EmailVerificationButtonProps) => {
  const [state, setState] = useState<EmailVerifiedState>(isEmailVerified ? "verified" : "unverified");
  // 이메일 인증 요청을 서버에서 아직 처리중인지 여부
  const [isEmailSending, setIsEmailSending] = useState(false);
  // 이메일 인증 요청 후, 다시 인증 이메일을 보낼 수 있는 시간(초)
  const [canSendEmailAfter, setCanSendEmailAfter] = useState(0);
  // 이메일 인증 요청 확인 다이얼로그 open flag
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);


  // props.isEmailVerified와 state를 동기화
  useEffect(() => {
    if (isEmailVerified) {
      setState("verified");
    } else {
      setState("unverified");
    }
  }, [isEmailVerified]);

  /**
   * seconds초 이후에 인증 이메일을 재발송할 수 있는 상태로 만든다.
   * 초마다 canSendEmailAfter를 1씩 감소시켜, 0이 되면 종료한다.
   */
  const makeCanSendEmailAfter = useCallback((seconds: number) => {
    setCanSendEmailAfter(seconds);
    const interval = setInterval(() => {
      setCanSendEmailAfter((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // 이메일 인증 요청
  const handleVerifyEmail = useCallback(async () => {
    setOpenConfirmDialog(false);
    setIsEmailSending(true);
    const result = await UserApi.requestEmailVerification({ email: email.value });
    if (result.code === "success") {
      setState("verification-email-sended");
      makeCanSendEmailAfter(VERIFICAITON_EMAIL_SEND_INTERVAL);
    } else {
      onErrorChange(result.message);
    }
    setIsEmailSending(false);
  }, [email.value, makeCanSendEmailAfter, onErrorChange]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      {state === "unverified" && (
        <Button
          variant="contained"
          onClick={() => setOpenConfirmDialog(true)}
          loading={isEmailSending}
          disabled={!!email.error}
        >
          인증 메일 보내기
        </Button>
      )}
      {state === "verification-email-sended" && (
        <Button
          variant="outlined"
          onClick={() => setOpenConfirmDialog(true)}
          disabled={canSendEmailAfter !== 0}
          loading={isEmailSending}
        >
          {canSendEmailAfter > 0 ? (
            <>{canSendEmailAfter}초 후에 재발송 가능</>
          ) : (
            <>인증 이메일 재발송</>
          )}
        </Button>
      )}
      {state === "verified" && (
        <>
          <Description sx={{ mr: 1, fontSize: "0.7em" }}>
            변경할 이메일로 인증 메일을 보내드립니다. 인증을 완료하시면 이메일이 변경됩니다.
          </Description>
          <Button
            variant="contained"
            onClick={() => setOpenConfirmDialog(true)}
            loading={isEmailSending}
            disabled={!!email.error || email.value === originalEmail}
          >
            이메일 변경
          </Button>
        </>
      )}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>
          이메일 인증 요청
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component="span" color='primary'>
              {`'${email.value}'`}
            </Typography>
            로 인증 메일을 보내시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
          >
            아니요
          </Button>
          <Button
            variant='contained'
            onClick={handleVerifyEmail}
            autoFocus
          >
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

type Props = {
  // original email & email verification
  isEmailVerified: boolean;
  email: string

  sx?: SxProps;
};
export const EmailSetting = ({
  isEmailVerified,
  email: originalEmail,
  sx,
}: Props) => {
  const [email, setEmail] = useState<Field>({
    value: originalEmail,
    error: "",
  });


  return (
    <>
      <Box>
        <SettingTitle
          sx={{ display: "flex", alignItems: "center" }}
        >
          이메일
          {isEmailVerified ? (
            <Chip
              label="인증됨"
              color="success"
              size="small"
              sx={{ ml: 1 }}
            />
          ) : (
            <Chip
              label="인증 필요"
              color="error"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </SettingTitle>

        <EmailField
          email={email}
          onChange={setEmail}
        />
        <EmailVerificationButton
          email={email}
          originalEmail={originalEmail}
          isEmailVerified={isEmailVerified}
          onErrorChange={(error) => setEmail((prev) => ({ ...prev, error }))}
        />
      </Box>
    </>
  );
}
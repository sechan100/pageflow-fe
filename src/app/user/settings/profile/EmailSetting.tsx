"use client";

import { UserApi } from '@/entities/user';
import { EmailField } from '@/features/user';
import { Field } from '@/shared/field';
import {
  Box,
  Button,
  Chip,
  SxProps,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";


type EmailVerifiedState = "unverified" | "verification-email-sended" | "verified"

const VERIFICAITON_EMAIL_SEND_INTERVAL = 20;

type EmailVerificationButtonProps = {
  isEmailVerified: boolean
  email: string
  className?: string
}
const EmailVerificationButton = ({
  isEmailVerified,
  email,
  className
}: EmailVerificationButtonProps) => {
  const [state, setState] = useState<EmailVerifiedState>(isEmailVerified ? "verified" : "unverified");
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [canSendEmailAfter, setCanSendEmailAfter] = useState(0);


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
    setIsEmailSending(true);
    await UserApi.requestEmailVerification();
    setState("verification-email-sended");
    makeCanSendEmailAfter(VERIFICAITON_EMAIL_SEND_INTERVAL);
    setIsEmailSending(false);
  }, [makeCanSendEmailAfter]);


  if (isEmailVerified) {
    return <></>
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      {state === "unverified" && (
        <>
          <Typography variant="subtitle2" color="textDisabled">
            현재 이메일: {email}&nbsp;
          </Typography>
          <Button
            variant="outlined"
            onClick={handleVerifyEmail}
            loading={isEmailSending}
          >
            인증 메일 보내기
          </Button>
        </>
      )}
      {state === "verification-email-sended" && (
        <>
          <Typography variant="subtitle2" color="textDisabled">
            현재 이메일: {email}&nbsp;
          </Typography>
          <Button
            variant="outlined"
            onClick={handleVerifyEmail}
            disabled={canSendEmailAfter !== 0}
            loading={isEmailSending}
          >
            {canSendEmailAfter > 0 ? (
              <>{canSendEmailAfter}초 후에 재발송 가능</>
            ) : (
              <>인증 이메일 재발송</>
            )}
          </Button>
        </>
      )}
    </Box>
  )
}

type Props = {
  // email
  email: Field;
  onChange: (field: Field) => void;

  // original email & email verification
  isEmailVerified: boolean;
  originalEmail: string

  sx?: SxProps;
};
export const EmailSetting = ({
  email,
  onChange,
  isEmailVerified,
  originalEmail,
  sx,
}: Props) => {


  return (
    <>
      <Box>
        <Typography
          variant="h6"
          gutterBottom
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
        </Typography>

        <EmailField
          email={email}
          onChange={onChange}
        />
        <EmailVerificationButton
          isEmailVerified={isEmailVerified}
          email={originalEmail}
        />
      </Box>
    </>
  );
}
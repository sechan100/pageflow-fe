"use client";

import { emailVerificationRequest } from "@/entities/user/email-verification-reques";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  // email
  email: string
  onChange: (email: string) => void;

  // original email & email verification
  isEmailVerified: boolean;
  originalEmail: string

  // error
  error: string | null;
  onErrorChange: (error: string | null) => void;
  className?: string;
};
export const EmailSettingFeature = ({
  email,
  onChange,
  isEmailVerified,
  originalEmail,
  error,
  onErrorChange,
  className,
}: Props) => {

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    onChange(newEmail);

    // 이메일 형식 검증
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!isEmail) {
      onErrorChange("유효한 이메일 형식이 아닙니다.");
    } else {
      onErrorChange(null);
    }
  }, [onChange, email]);


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

        <TextField
          fullWidth
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={!!error}
          helperText={error}
          slotProps={{
            input: {
              sx: {
                color: "black",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Mail />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />
        <EmailVerificationButton
          isEmailVerified={isEmailVerified}
          email={originalEmail}
        />
      </Box>
    </>
  );
}


type EmailVerifiedState = "unverified" | "verification-email-sended" | "verified"

const VERIFICAITON_EMAIL_SEND_INTERVAL = 20;

type EmailVerificationButtonProps = {
  isEmailVerified: boolean
  /**
   * 변경 가능한 이메일
   */
  email: string
  className?: string
}
export const EmailVerificationButton = ({
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


  // 이메일 인증 요청
  const handleVerifyEmail = useCallback(async () => {
    setIsEmailSending(true);
    await emailVerificationRequest();
    setState("verification-email-sended");
    makeCanSendEmailAfter(VERIFICAITON_EMAIL_SEND_INTERVAL);
    setIsEmailSending(false);
  }, []);

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
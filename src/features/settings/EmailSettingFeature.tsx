"use client";

import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Mail } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  email: string;
  isEmailVerified: boolean;
  /**
   * 변경사항을 저장하기 전의 이메일
   */
  originalEmail: string
  onEmailChange: (email: string) => void;
  onEmailValidChange: (isValid: boolean) => void;
  className?: string;
};
export const EmailSettingFeature = ({
  email,
  isEmailVerified,
  originalEmail,
  onEmailChange,
  onEmailValidChange,
  className,
}: Props) => {
  const [fieldError, _setFieldError] = useState<string | null>(null);

  const setFieldError = useCallback((error: string | null) => {
    _setFieldError(error);
    onEmailValidChange(error !== null);
  }, []);


  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    onEmailChange(newEmail);

    // 이메일 형식 검증
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!isEmail) {
      setFieldError("유효한 이메일 형식이 아닙니다.");
      return;
    }
    setFieldError(null);
  }, [onEmailChange, email]);


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
          error={!!fieldError}
          helperText={fieldError}
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
  const [canSendEmailAfter, setCanSendEmailAfter] = useState(0);


  // 이메일 인증 요청
  const handleVerifyEmail = useCallback(async () => {
    console.log("인증 이메일 구현");
    setState("verification-email-sended");
    makeCanSendEmailAfter(VERIFICAITON_EMAIL_SEND_INTERVAL);
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
          <Button variant="outlined" onClick={handleVerifyEmail}>
            인증 메일 보내기
          </Button>
        </>
      )}
      {state === "verification-email-sended" && (
        <>
          <Typography variant="subtitle2" color="textDisabled">
            현재 이메일: {email}&nbsp;
          </Typography>
          <Button variant="outlined" onClick={handleVerifyEmail} disabled={canSendEmailAfter !== 0}>
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
"use client";

import { useState, ChangeEvent, FormEvent, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Paper,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  SxProps
} from '@mui/material';
import { PageflowLogo } from '@/shared/components/Logo';
import { Description } from '@/shared/components/Description';
import { Field, FieldErrorDispatcher } from '@/shared/field';
import { EmailField, PasswordField, PennameField, UsernameField } from '@/features/user';
import { UserApi } from '@/entities/user';
import { useNextRouter } from '@/shared/hooks/useNextRouter';
import { useNotification } from '@/shared/notification';


const fieldSx: SxProps = {
  mb: 2
}

const links = {
  login: '/?login=true'
}

export default function SignupPage() {
  const { router } = useNextRouter();
  const notification = useNotification();

  // [[ fields
  const [username, setUsername] = useState<Field>({ value: '', error: null });
  const [password, setPassword] = useState<Field>({ value: '', error: null });
  const [email, setEmail] = useState<Field>({ value: '', error: null });
  const [penname, setPenname] = useState<Field>({ value: '', error: null });
  // ]]

  // [[ 모든 필드들 상태
  const isAllFieldValid = useMemo(() => {
    return !username.error && !password.error && !email.error && !penname.error;
  }, [username, password, email, penname]);

  const isAllFieldFilled = useMemo(() => {
    return !!username.value && !!password.value && !!email.value && !!penname.value;
  }, [username.value, password.value, email.value, penname.value]);
  // ]]

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (!(isAllFieldValid && isAllFieldFilled)) throw new Error('모든 필드가 유효하지 않습니다.');
    e.preventDefault();

    const res = await UserApi.signup({
      username: username.value,
      password: password.value,
      email: email.value,
      penname: penname.value
    })

    switch (res.code) {
      case 'success':
        router.push(links.login);
        notification.success('회원가입이 완료되었습니다.');
        break;
      case 'field-error':
        new FieldErrorDispatcher(res.fieldErrors)
          .set('username', e => setUsername({ ...username, error: e }))
          .set('password', e => setPassword({ ...password, error: e }))
          .set('email', e => setEmail({ ...email, error: e }))
          .set('penname', e => setPenname({ ...penname, error: e }))
          .dispatch();
        break;
    }
  }, [isAllFieldValid, isAllFieldFilled, username, password, email, penname, router, notification]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my: 4
        }}
      >
        <PageflowLogo />
        <Description>
          회원가입을 위해 아래 정보를 입력해주세요.
        </Description>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* 회원가입 폼 */}
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 3 }}
          >
            회원정보
          </Typography>
          <UsernameField
            username={username}
            onChange={setUsername}
            sx={fieldSx}
          />
          <PasswordField
            password={password}
            onChange={setPassword}
            sx={fieldSx}
          />
          <EmailField
            email={email}
            onChange={setEmail}
            sx={fieldSx}
          />
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            프로필
          </Typography>
          <PennameField
            penname={penname}
            onChange={setPenname}
            sx={fieldSx}
          />
          <Description sx={{ my: 0, fontSize: '0.8em' }}>
            필명은 Pageflow에서 사용할 이름입니다.
          </Description>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!(isAllFieldValid && isAllFieldFilled)}
        >
          회원가입
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            이미 회원이신가요? <Link href={links.login}>로그인</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
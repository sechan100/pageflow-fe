import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { useLoginLogout } from '@/entities/user';
import { useNextRouter } from '@/shared/hooks/useNextRouter';
import { Field } from '@/shared/field';
import { PasswordField, UsernameField } from '@/features/user';


type SocialProvider = 'Google' | 'GitHub';

const links = {
  signup: '/signup',
}

/**
 * 로그인 모달 컴포넌트
 */
type Props = {
  open: boolean;
  handleClose: () => void;
}
export const LoginModal = ({
  open,
  handleClose
}: Props) => {
  const { login } = useLoginLogout();
  const { router, searchParams } = useNextRouter();

  /**
   * [[ fields
   * 사용자 인증 정보를 구체적으로 제공하지 않기위해서 error는 하나만 사용.
   */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // ]]


  // 로그인 성공 처리
  const onLoginSuccess = useCallback(() => {
    const returnUrl = searchParams.get('returnUrl') || '/';
    router.replace(returnUrl);
  }, [router, searchParams]);


  // 로그인 처리 로직 구현
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await login(username, password);

    switch (result.code) {
      case "success":
        onLoginSuccess();
        handleClose();
        break;
      case "error":
      // intentional fallthrough
      case "already-logined":
        setError(result.message);
        break;
    }
  }, [login, username, password, onLoginSuccess, handleClose]);


  // 소셜 로그인 처리 로직 구현
  const handleSocialLogin = useCallback((provider: SocialProvider) => {
    console.log(`${provider} login requested`);
  }, []);


  // 비밀번호 찾기
  const handleForgotPassword = useCallback(() => {
    console.log('Forgot password clicked');
  }, []);


  // 회원가입 페이지로 이동
  const handleSignUp = useCallback(() => {
    router.push(links.signup);
    handleClose();
  }, [handleClose, router]);


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" align="center" fontWeight="bold">
          로그인
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            계정 정보를 입력하여 로그인하세요.
          </DialogContentText>

          {/* Fields */}
          <UsernameField
            username={{ value: username, error: null }}
            onChange={({ value }: Field) => setUsername(value)}
          />
          <PasswordField
            password={{ value: password, error: error }}
            onChange={({ value }: Field) => setPassword(value)}
          />

          {/* 비밀번호 잊음? */}
          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={handleForgotPassword}
            >
              비밀번호를 잊으셨나요?
            </Typography>
          </Box>

          {/* 제출 */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>

          {/* 또는 */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              또는
            </Typography>
          </Divider>

          {/* 소셜 로그인 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialLogin('Google')}
              sx={{ width: '48%' }}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={() => handleSocialLogin('GitHub')}
              sx={{ width: '48%' }}
            >
              GitHub
            </Button>
          </Box>
        </DialogContent>

        {/* 회원가입 */}
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Typography variant="body2">
            계정이 없으신가요?{' '}
            <Typography
              component="span"
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              onClick={handleSignUp}
            >
              회원가입
            </Typography>
          </Typography>
        </DialogActions>
      </form>
    </Dialog>
  );
};

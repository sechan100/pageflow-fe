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
import { useLoginLogout } from '@/entities/user/use-login-logout';
import { useNotification } from '@/shared/notification';
import { useFieldValidation } from '@/shared/field-validation';

type LoginDialogProps = {
  open: boolean;
  handleClose: () => void;
}

type FormData = {
  username: string;
  password: string;
}

type SocialProvider = 'Google' | 'GitHub';

export const LoginModal = ({
  open,
  handleClose
}: LoginDialogProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const { login } = useLoginLogout();
  const notification = useNotification();
  const { setFieldValidation, getFieldError } = useFieldValidation()
  

  // 입력값 변경
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }, []);

  
  // 비밀번호 보이기/숨기기
  const handleClickShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);


  // 로그인 처리 로직 구현
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await login(formData.username, formData.password);

    switch(result.code) {
      case "success":
        handleClose();
        break;
      case "field-error":
        setFieldValidation(result.fieldValidationResult);
        break;
      case "already-logined":
        notification.warn(result.message);
        break;
    }
  }, [formData, handleClose]);


  // 소셜 로그인 처리 로직 구현
  const handleSocialLogin = useCallback((provider: SocialProvider) => {
    console.log(`${provider} login requested`);
  }, []);


  // 비밀번호 찾기
  const handleForgotPassword = useCallback(() => {
    console.log('Forgot password clicked');
  }, []);

  
  // 회원가입 다이얼로그 열기 로직
  const handleSignUp = useCallback(() => {
    handleClose();
    console.log('Sign up clicked');
  }, [handleClose]);


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
          
          <TextField
            id="username"
            name="username"
            label="아이디"
            type="username"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleInputChange}
            error={getFieldError("username") != null}
            helperText={getFieldError("username")?.message}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            id="password"
            name="password"
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            error={getFieldError("password") != null}
            helperText={getFieldError("password")?.message}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
                    
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
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              또는
            </Typography>
          </Divider>
          
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
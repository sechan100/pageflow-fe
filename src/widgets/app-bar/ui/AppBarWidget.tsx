'use client';

import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  AppBar,
  Drawer,
  Container,
  Toolbar,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha, styled } from '@mui/material/styles';
import { useState } from 'react';
import { BarLogo } from './BarLogo';
import ColorModeIconDropdown from './ColorModeIconDropdown';
import { UserWidget } from './UserWidget';
import { STYLES } from '@/global/styles';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.cssVariables || theme).palette.divider,
  backgroundColor: theme.cssVariables
    ? `rgba(${theme.palette.background.default} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.cssVariables || theme).shadows[1],
  padding: '8px 12px',
}));



export const AppBarWidget = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      color='transparent'
      sx={{
        boxShadow: 0,
        bgcolor: STYLES.color.background,
        mt: 1,
        "&::after": {
          content: '""',
          position: 'absolute',
          top: -8,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: STYLES.color.background,
          zIndex: -1,
        }
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* 로고와 메뉴들 */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <BarLogo />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="primary" size="small">
                Features
              </Button>
              <Button variant="text" color="primary" size="small">
                Testimonials
              </Button>
              <Button variant="text" color="primary" size="small">
                Highlights
              </Button>
              <Button variant="text" color="primary" size="small">
                Pricing
              </Button>
              <Button variant="text" color="primary" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button>
              <Button variant="text" color="primary" size="small" sx={{ minWidth: 0 }}>
                Blog
              </Button>
            </Box>
          </Box>

          {/* UserWidget 영역 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
          }}>
            <UserWidget />
          </Box>

          {/* 모바일 드롭다운 */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
'use client';

import { STYLES } from '@/global/styles';
import {
  AppBar, Container
} from '@mui/material';
import { useState } from 'react';
import { BarLogo } from './BarLogo';
import { UserWidget } from './UserWidget';


export const AppBarWidget = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="static"
      color='transparent'
      sx={{
        boxShadow: 0,
        bgcolor: STYLES.color.background,
        py: 1,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <BarLogo />
        <UserWidget />
      </Container>
    </AppBar>
  );
}
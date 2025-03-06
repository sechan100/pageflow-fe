'use client';

import { Theme, ThemeProvider, createTheme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { STYLES } from '@/global/styles';
import { CssBaseline } from '@mui/material';


const theme = createTheme({
  palette: {
    primary: {
      main: STYLES.color.primary,
      contrastText: '#FAFAFA',
    },
    secondary: {
      main: STYLES.color.secondary,
      contrastText: '#fff',
    },
  },
});


type MUIThemeProviderProps = {
  children: React.ReactNode;
}
export const MUIThemeProvider = (props: MUIThemeProviderProps) => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {props.children}
    </ThemeProvider>
  )
}
import {
  Box, Divider,
  Drawer,
  IconButton, Typography
} from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { TocRoot } from './TocRoot';
import { useSideDrawerStore } from './use-side-drawer-store';


const OpenButton = () => {
  const open = useSideDrawerStore(state => state.open);

  return (
    <Box sx={{
      position: "fixed",
      top: 10,
      left: 10,
      zIndex: 1000,
    }}>
      <IconButton onClick={open}>
        <ChevronRight />
      </IconButton>
    </Box>
  )
}

const SideDrawerTitle = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
    }}>
      <Typography variant="h6">목차</Typography>
    </Box>
  )
}

const sideDrawerWidth = 400;

export const SideDrawer = () => {
  const isOpen = useSideDrawerStore(state => state.isOpen);
  const close = useSideDrawerStore(state => state.close);

  return (
    <>
      <OpenButton />
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={close}
        variant="temporary"
        sx={{
          width: isOpen ? sideDrawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sideDrawerWidth,
            boxSizing: 'border-box',
            height: '100%',
          },
        }}
      >
        <SideDrawerTitle />
        <Divider />
        <TocRoot />
      </Drawer>
    </>
  );
};

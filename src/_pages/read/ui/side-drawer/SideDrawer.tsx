import {
  Box, Drawer,
  IconButton, SxProps, Typography
} from '@mui/material';
import { ChevronRight } from 'lucide-react';
import { LinearBookProgress } from '../LinearBookProgress';
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

const SideDrawerTitle = ({ sx }: { sx?: SxProps }) => {
  return (
    <Box sx={sx}>
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
        <SideDrawerTitle sx={{
          px: 2,
          pt: 3,
        }} />
        <LinearBookProgress sx={{
          mt: 1,
          mb: 2,
        }} />
        <TocRoot />
      </Drawer>
    </>
  );
};

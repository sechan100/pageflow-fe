import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Drawer,
  IconButton, Typography
} from '@mui/material';
import { useState } from 'react';
import { TocRoot } from './TocRoot';



export const ReaderTocSidebar = () => {
  const [open, setOpen] = useState(true);
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: open ? 300 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
          top: 'auto',
          height: 'calc(100% - 64px)',
          marginTop: '64px', // Adjust based on your app bar height
        },
      }}
    >
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6">목차</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <TocRoot />
    </Drawer>
  );
};

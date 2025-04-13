import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';
import React from 'react';

interface TocItem {
  id: string;
  title: string;
  targetId?: string;
  children?: TocItem[];
}

interface TocSidebarProps {
  toc: TocItem[];
  open: boolean;
  onClose: () => void;
}

export const TocSidebar: React.FC<TocSidebarProps> = ({
  toc,
  open,
  onClose
}) => {
  const renderTocItems = (items: TocItem[], level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              pl: 2 + level * 2,
              py: 1
            }}
            onClick={() => {
              // Handle navigation to specific section
              if (item.targetId) {
                const element = document.getElementById(item.targetId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }

              // On mobile, close the drawer after navigation
              if (window.innerWidth < 600) {
                onClose();
              }
            }}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontSize: 16 - level * 0.5,
                fontWeight: level === 0 ? 'bold' : 'normal'
              }}
            />
          </ListItemButton>
        </ListItem>
        {item.children && item.children.length > 0 && (
          renderTocItems(item.children, level + 1)
        )}
      </React.Fragment>
    ));
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
      <List sx={{ p: 0 }}>
        {toc.length > 0 ? (
          renderTocItems(toc)
        ) : (
          <ListItem>
            <ListItemText primary="목차가 없습니다." />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

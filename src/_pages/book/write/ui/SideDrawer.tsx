'use client'
import { useTocQuery } from "@/entities/book";
import { TocWidget } from "@/widgets/book";
import {
  ChevronLeft as ChevronLeftIcon, Menu as MenuIcon
} from "@mui/icons-material";
import {
  Box, Drawer,
  IconButton, SxProps,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useBook } from "../model/use-book";

const drawerWidth = 240;

type Props = {
  sx?: SxProps;
}

export const SideDrawer = ({
  sx,
}: Props) => {
  const { book } = useBook();
  const { toc, isError, isLoading } = useTocQuery(book.id);
  const [open, setOpen] = useState(true);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  if (!open) {
    return (
      <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1200 }}>
        <Tooltip title="목차 열기">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  if (isLoading) {
    return <div>loading...</div>
  }
  if (isError) {
    return <div>error...</div>
  }

  return (
    <Drawer
      slotProps={{
        paper: {
          sx: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          }
        },
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
        ...(sx || {})
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {book.title}
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <TocWidget
        svToc={toc}
      />
    </Drawer>
  );
};
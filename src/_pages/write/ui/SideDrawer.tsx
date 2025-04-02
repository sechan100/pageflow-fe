'use client'
import { useEditorBookStore } from "@/entities/book";
import { TooltipIconButton } from "@/shared/ui/TootipIconButton";
import { TocTree } from "@/widgets/editor-toc";
import {
  Box, Drawer, SxProps, Typography
} from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { sideDrawerWidth } from "../config/side-drawer-width";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  sx?: SxProps;
}

export const SideDrawer = ({
  open,
  onClose,
  onOpen,
  sx,
}: Props) => {
  const { book } = useEditorBookStore();

  const handleDrawerClose = () => {
    onClose();
  };

  const handleDrawerOpen = () => {
    onOpen();
  };

  return (
    <>
      {!open && <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1200 }}>
        <TooltipIconButton
          icon={<ChevronRightIcon />}
          tooltip="목차 열기"
          onClick={handleDrawerOpen}
        />
      </Box>}
      <Drawer
        slotProps={{
          paper: {
            sx: {
              width: sideDrawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            }
          },
        }}
        sx={{
          width: sideDrawerWidth,
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
          <TooltipIconButton
            icon={<ChevronLeftIcon />}
            tooltip="목차 닫기"
            onClick={handleDrawerClose}
          />
        </Box>
        <TocTree />
      </Drawer >
    </>
  );
};
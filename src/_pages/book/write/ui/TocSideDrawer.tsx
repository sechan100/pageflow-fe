'use client'
import { TocFolder, TocNode, useTocQuery } from "@/entities/book";
import {
  Article as ArticleIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useBook } from "../model/use-book";

const drawerWidth = 240;

type Props = {
  sx?: SxProps;
}

export const TocSideDrawer = ({
  sx,
}: Props) => {
  const { book } = useBook();
  const { toc, isError, isLoading } = useTocQuery(book.id);
  const [open, setOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // 재귀적으로 TOC 노드를 렌더링하는 함수
  const renderTocNode = (node: TocNode, depth = 0) => {
    const isFolder = node.type === "FOLDER";
    const isFolderExpanded = isFolder && expandedFolders[node.id];

    if (isFolder) {
      const folder = node as TocFolder;
      return (
        <Box key={node.id}>
          <ListItemButton
            onClick={() => toggleFolder(node.id)}
            sx={{ pl: 2 + depth * 2 }}
          >
            <ListItemIcon>
              {isFolderExpanded ? <FolderOpenIcon /> : <FolderIcon />}
            </ListItemIcon>
            <ListItemText
              primary={node.title}
              primaryTypographyProps={{
                noWrap: true,
                title: node.title
              }}
            />
            {isFolderExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={isFolderExpanded} timeout="auto" unmountOnExit>
            <List disablePadding>
              {folder.children.map(child => renderTocNode(child, depth + 1))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItemButton
        key={node.id}
        sx={{ pl: 2 + depth * 2 }}
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText
          primary={node.title}
          primaryTypographyProps={{
            noWrap: true,
            title: node.title
          }}
        />
      </ListItemButton>
    );
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
      <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {toc?.root?.children?.map(node => renderTocNode(node)) ||
          <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
            목차가 없습니다.
          </Typography>
        }
      </List>
    </Drawer>
  );
};
'use client'
import { isReadableTocFolder, isReadableTocSection, ReadableTocFolder, ReadableTocNode, ReadableTocSection } from '@/entities/book';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { useState } from "react";
import { useTocContext } from "../../stores/toc-context";

type TocFolderProps = {
  folder: ReadableTocFolder;
  level: number;
  sx?: SxProps;
}
const TocFolderNode = ({
  folder,
  level,
  sx
}: TocFolderProps) => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem disablePadding sx={sx}>
        <ListItemButton
          onClick={handleToggle}
          sx={{
            pl: 2 + level * 2,
            py: 1,
            bgcolor: open ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {open ? <FolderOpenIcon color="primary" /> : <FolderIcon color="primary" />}
          </ListItemIcon>
          <ListItemText
            primary={folder.title}
            primaryTypographyProps={{
              fontSize: 16 - level * 0.5,
              fontWeight: 'medium'
            }}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {folder.children.map(node => renderTocNode(node, level + 1))}
        </List>
      </Collapse>
    </>
  );
};

type TocSectionProps = {
  section: ReadableTocSection;
  level: number;
  sx?: SxProps;
}
const TocSectionNode = ({
  section,
  level,
  sx
}: TocSectionProps) => {
  const handleClick = () => {
    // Handle navigation to specific section
    if (section.id) {
      const element = document.getElementById(section.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <ListItem disablePadding sx={sx}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: 2 + level * 2,
          py: 1
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <ArticleIcon color="action" />
        </ListItemIcon>
        <ListItemText
          primary={section.title}
          primaryTypographyProps={{
            fontSize: 16 - level * 0.5,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

const renderTocNode = (node: ReadableTocNode, level: number) => {
  if (isReadableTocFolder(node)) {
    return <TocFolderNode key={node.id} folder={node} level={level} />;
  } else if (isReadableTocSection(node)) {
    return <TocSectionNode key={node.id} section={node} level={level} />;
  }
  return null;
};

export const TocRoot = () => {
  const toc = useTocContext();

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="table of contents">
        {toc.root.children.map(node => renderTocNode(node, 0))}
      </List>
    </Box>
  );
};
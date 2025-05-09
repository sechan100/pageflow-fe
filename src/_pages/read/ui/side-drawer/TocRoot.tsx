'use client'
import { isReadableTocFolder, isReadableTocSection, ReadableTocFolder, ReadableTocNode, ReadableTocNodeType, ReadableTocSection } from '@/entities/book';
import { Box, List, ListItem, SxProps, Typography } from "@mui/material";
import { useCallback, useMemo } from 'react';
import { ReadingBookmark, useBookmarkStore } from '../../stores/bookmark-store';
import { useTocContext } from "../../stores/toc-context";
import { useSideDrawerStore } from './use-side-drawer-store';

const nodeStyle: SxProps = {
  py: 0.5,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.15s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}

const defaultPl = 2;

const getPlByLevel = (level: number) => {
  return defaultPl + level * 2;
}

const useReadTocNode = () => {
  const navigateTo = useBookmarkStore(s => s.navigateTo);

  const readNode = useCallback((id: string, type: ReadableTocNodeType) => {
    const newBookmark: ReadingBookmark = {
      tocNodeId: id,
      tocNodeType: type,
      sceId: 0,
    }
    navigateTo(newBookmark);
  }, [navigateTo]);

  return {
    readNode
  }
}

const useCurrentTocNode = (tocNodeId: string) => {
  const bookmark = useBookmarkStore(s => s.bookmark);
  const isCurrentNode = useMemo(() => {
    if (!bookmark) return false;
    return bookmark.tocNodeId === tocNodeId;
  }, [bookmark, tocNodeId]);
  return {
    isCurrentNode
  }
}

const currentTocNodeStyle: SxProps = {
  // backgroundColor: STYLES.color.primary
}

type TocFolderProps = {
  folder: ReadableTocFolder;
  level: number;
}
const TocFolderNode = ({
  folder,
  level,
}: TocFolderProps) => {
  const { readNode } = useReadTocNode();
  const close = useSideDrawerStore(s => s.close);
  const { isCurrentNode } = useCurrentTocNode(folder.id);

  const handleClick = useCallback(() => {
    readNode(folder.id, "FOLDER");
    close();
  }, [close, folder.id, readNode]);

  return (
    <>
      <ListItem
        dense
        disablePadding
        onClick={handleClick}
        sx={{
          pl: getPlByLevel(level),
          ...nodeStyle,
          ...(isCurrentNode ? currentTocNodeStyle : {}),
        }}
      >
        <Typography variant='subtitle1'>
          {folder.title}
        </Typography>
      </ListItem>
      <List component="div" disablePadding>
        {folder.children.map(node => renderTocNode(node, level + 1))}
      </List>
    </>
  );
};

type TocSectionProps = {
  section: ReadableTocSection;
  level: number;
}
const TocSectionNode = ({
  section,
  level,
}: TocSectionProps) => {
  const { readNode } = useReadTocNode();
  const close = useSideDrawerStore(s => s.close);
  const { isCurrentNode } = useCurrentTocNode(section.id);

  const handleClick = useCallback(() => {
    readNode(section.id, "SECTION");
    close();
  }, [readNode, section.id, close]);

  return (
    <ListItem
      dense
      disablePadding
      onClick={handleClick}
      sx={{
        pl: getPlByLevel(level),
        ...nodeStyle,
        ...(isCurrentNode ? currentTocNodeStyle : {}),
      }}
    >
      <Typography variant='body2'>
        {section.title}
      </Typography>
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
    <Box sx={{
      width: '100%',
      mt: 2,
      mb: 5,
    }}>
      <List component="nav" disablePadding>
        {toc.root.children.map(node => renderTocNode(node, 0))}
      </List>
    </Box>
  );
};
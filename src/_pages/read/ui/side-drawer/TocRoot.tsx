'use client'
import { isReadableTocFolder, isReadableTocSection, ReadableTocFolder, ReadableTocNode, ReadableTocSection } from '@/entities/book';
import { Box, List, ListItem, SxProps, Typography } from "@mui/material";
import { useTocContext } from "../../stores/toc-context";

const defaultPl = 2;

const getPlByLevel = (level: number) => {
  return defaultPl + level * 2;
}

const useReadTocNode = () => {

  return {
    readNode: (id: string) => {
    }
  }
}

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
  const { readNode } = useReadTocNode();

  return (
    <>
      <ListItem dense disablePadding sx={sx}>
        <Box
          onClick={() => readNode(folder.id)}
          sx={{
            pl: getPlByLevel(level),
            py: 1,
          }}
        >
          <Typography variant='subtitle1'>
            {folder.title}
          </Typography>
        </Box>
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
  sx?: SxProps;
}
const TocSectionNode = ({
  section,
  level,
  sx
}: TocSectionProps) => {
  const { readNode } = useReadTocNode();

  return (
    <ListItem dense disablePadding sx={sx}>
      <Box
        onClick={() => readNode(section.id)}
        sx={{
          pl: getPlByLevel(level),
          py: 1
        }}
      >
        <Typography variant='body2'>
          {section.title}
        </Typography>
      </Box>
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
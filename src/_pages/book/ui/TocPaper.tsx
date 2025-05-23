'use client';

import { isReadableTocFolder, isReadableTocSection, ReadableTocFolder, ReadableTocNode, ReadableTocSection } from "@/entities/book";
import { Box, SxProps, Typography } from "@mui/material";
import { usePublishedBookContext } from "../model/published-book-context";
import { BasePaper, PaperHeader } from "./utils/base-paper";


type FolderNodeProps = {
  folder: ReadableTocFolder;
  level: number;
  sx?: SxProps;
}
const FolderNode = ({
  folder,
  level,
  sx
}: FolderNodeProps) => {

  return (
    <Box key={folder.id}>
      <Box
        sx={{
          pl: level * 2,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: "none",
          borderColor: 'divider',
        }}
      >
        <Typography variant={"body2"}>
          {folder.title}
        </Typography>
      </Box>
      {folder.children.map(child => renderTocNode(child, level + 1))}
    </Box>
  )
}

type SectionNodeProps = {
  section: ReadableTocSection;
  level: number;
  sx?: SxProps;
}
const SectionNode = ({
  section,
  level,
  sx
}: SectionNodeProps) => {

  return (
    <Box
      key={section.id}
      sx={{
        pl: level * 2,
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        borderBottom: 'none',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant={"body2"}
        sx={{
          fontWeight: 400,
          color: 'text.primary',
        }}
      >
        {section.title}
      </Typography>
    </Box>
  )
}

const renderTocNode = (node: ReadableTocNode, level = 0) => {
  if (isReadableTocSection(node)) {
    return (
      <SectionNode
        key={node.id}
        section={node}
        level={level}
      />
    );
  } else if (isReadableTocFolder(node)) {
    return (
      <FolderNode
        key={node.id}
        folder={node}
        level={level}
      />
    );
  } else {
    throw new Error("Unknown toc node type");
  }
};

export const TocPaper = () => {
  const book = usePublishedBookContext();

  return (
    <BasePaper>
      <PaperHeader title="목차" />
      <Box sx={{ pl: 2 }}>
        {book.toc.root.children.map(child => renderTocNode(child))}
      </Box>
    </BasePaper>
  );
};

'use client';

import { isReadOnlyTocFolder, isReadOnlyTocSection, ReadOnlyTocFolder, ReadOnlyTocNode, ReadOnlyTocSection } from "@/entities/reader";
import { Box, SxProps, Typography } from "@mui/material";
import { usePublishedBookContext } from "../model/published-book-context";
import { SectionHeader } from "./utils/SectionHeader";
import { SectionPaper } from "./utils/SectionPaper";


type FolderNodeProps = {
  folder: ReadOnlyTocFolder;
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
  section: ReadOnlyTocSection;
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

const renderTocNode = (node: ReadOnlyTocNode, level = 0) => {
  if (isReadOnlyTocSection(node)) {
    return (
      <SectionNode
        key={node.id}
        section={node}
        level={level}
      />
    );
  } else if (isReadOnlyTocFolder(node)) {
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

export const TableOfContents = () => {
  const book = usePublishedBookContext();

  return (
    <SectionPaper>
      <SectionHeader title="목차" />
      <Box sx={{ pl: 2 }}>
        {book.toc.root.children.map(child => renderTocNode(child))}
      </Box>
    </SectionPaper>
  );
};

'use client'
import { Article, ExpandLess, ExpandMore } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo } from "react";
import { indentPerDepth } from "../config";
import { TocFolder, TocSection } from "../model/toc.type";



type StyledFolderNodeProps = {
  folder: TocFolder;
  depth: number;
  isOpen: boolean;
  onClick?: (folder: TocFolder) => void;
  sx?: SxProps
}
export const StyledFolderNode = memo(function Folder({
  folder,
  depth,
  isOpen,
  onClick,
  sx
}: StyledFolderNodeProps) {

  return (
    <>
      <ListItemButton
        onClick={() => onClick?.(folder)}
        sx={{
          pl: 2 + depth * indentPerDepth,
        }}
      >
        <ListItemIcon>
          {isOpen ? <ChevronDown /> : <ChevronRight />}
        </ListItemIcon>
        <ListItemText
          primary={folder.title}
          primaryTypographyProps={{
            noWrap: true,
            title: folder.title
          }}
        />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
    </>
  )
})

type StyledSectionNodeProps = {
  section: TocSection;
  depth: number;
  sx?: SxProps
}
export const StyledSectionNode = memo(function Section({
  section,
  depth,
  sx
}: StyledSectionNodeProps) {

  return (
    <ListItemButton
      key={section.id}
      sx={{
        pl: 2 + depth * indentPerDepth,
      }}
    >
      <ListItemIcon>
        <Article />
      </ListItemIcon>
      <ListItemText
        primary={section.title}
        primaryTypographyProps={{
          noWrap: true,
          title: section.title
        }}
      />
    </ListItemButton>
  )
})
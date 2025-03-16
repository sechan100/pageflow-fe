'use client'
import { ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { ChevronDown, ChevronRight, FilePen } from "lucide-react";
import { memo } from "react";
import { indentPerDepth } from "../config";
import { TocFolder, TocSection } from "../model/toc.type";


type NodeButtonProps = {
  depth: number;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  sx?: SxProps
}
const NodeButton = ({
  depth,
  icon,
  onClick,
  text,
  sx
}: NodeButtonProps) => {

  return (
    <ListItemButton
      dense
      onClick={onClick}
      sx={{
        pl: 1 + depth * indentPerDepth,
        position: 'relative',
      }}
    >
      <ListItemIcon sx={{
        minWidth: 0,
        mr: 1,
      }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={text}
        slotProps={{
          primary: {
            noWrap: true,
          }
        }}
      />
    </ListItemButton>
  )
}


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
    <NodeButton
      depth={depth}
      onClick={() => onClick?.(folder)}
      icon={isOpen ? <ChevronDown /> : <ChevronRight />}
      text={folder.title}
    />
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
    <NodeButton
      depth={depth}
      // icon={<NotepadText />}
      // icon={<File size={20} />}
      icon={<FilePen size={20} />}
      text={section.title}
    />
  )
})
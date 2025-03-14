'use client'
import { Article } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { memo } from "react";
import { TocSection } from "../model/toc.type";



type Props = {
  section: TocSection;
  depth: number;
  sx?: SxProps
}
export const SectionNode = memo(function SectionNode({
  section,
  depth,
  sx
}: Props) {

  return (
    <ListItemButton
      key={section.id}
      sx={{ pl: 2 + depth * 2 }}
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
'use client'
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material"
import { FolderIcon, FolderOpenIcon } from "lucide-react"
import { memo } from "react"
import { TocFolder } from "../model/toc.type"
import { useToc } from "../model/use-toc"
import { renderTocNode } from "./render-toc-node"



type Props = {
  folder: TocFolder;
  depth: number;
  sx?: SxProps
}
export const FolderNode = memo(function FolderNode({
  folder,
  depth,
  sx
}: Props) {
  const toggleFolder = useToc(s => s.toggleFolder);
  console.log('FolderNode', folder.title)

  return (
    <>
      <Box key={folder.id}>
        <ListItemButton
          onClick={() => toggleFolder(folder.id)}
          sx={{ pl: 2 + depth * 2 }}
        >
          <ListItemIcon>
            {folder.isOpen ? <FolderOpenIcon /> : <FolderIcon />}
          </ListItemIcon>
          <ListItemText
            primary={folder.title}
            primaryTypographyProps={{
              noWrap: true,
              title: folder.title
            }}
          />
          {folder.isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={folder.isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {folder.children.map(child => renderTocNode(child, depth + 1))}
          </List>
        </Collapse>
      </Box >
    </>
  )
})
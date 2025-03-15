'use client'
import { SxProps } from "@mui/material";
import { memo } from "react";
import { TocSection } from "../model/toc.type";
import { Dndable } from "./Dndable";
import { StyledSectionNode } from "./styled-toc-node";



type Props = {
  section: TocSection;
  depth: number;
  sx?: SxProps
}
export const DndTocSection = memo(function DroppableSection({
  section,
  depth,
  sx
}: Props) {

  return (
    <Dndable
      node={section}
      depth={depth}
    >
      <StyledSectionNode
        section={section}
        depth={depth}
      />
    </Dndable>
  );
})
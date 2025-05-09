'use client'
import { Box, LinearProgress, SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ReadingUnitSequence } from "../model/reading-unit";
import { ReadingBookmark, useBookmarkStore } from "../stores/bookmark-store";
import { useReadingUnitStore } from "../stores/reading-unit-store";

const getTocNodeCount = (sequence: ReadingUnitSequence) => {
  let count = 0;
  for (const unit of sequence) {
    count += 1 + unit.tailNodes.length; // headNode + tailNodes
  }
  return count;
}

const calculateTocNodeProgress = (bookmark: ReadingBookmark, sequence: ReadingUnitSequence) => {
  const currentNodeId = bookmark.tocNodeId;
  let readedNodeCount = 0;
  out: for (const unit of sequence) {
    readedNodeCount++; // headNode
    if (unit.headNode.id === currentNodeId) {
      break out;
    }
    for (const tail of unit.tailNodes) {
      readedNodeCount++; // tailNode
      if (tail.id === currentNodeId) {
        break out;
      }
    }
  }
  return readedNodeCount / getTocNodeCount(sequence) * 100;
}


export const LinearBookProgress = ({ sx }: { sx?: SxProps }) => {
  const bookmark = useBookmarkStore(s => s.bookmark);
  const sequence = useReadingUnitStore(s => s.sequence);

  const [nodeProgress, setNodeProgress] = useState(0);

  useEffect(() => {
    if (bookmark === null) return;
    const newProgress = calculateTocNodeProgress(bookmark, sequence);
    setTimeout(() => {
      setNodeProgress(newProgress);
    }, 100);
  }, [bookmark, sequence]);

  return (
    <Box sx={{
      position: "relative",
      ...sx,
    }}>
      <Box sx={{
        position: "absolute",
        bottom: 5,
        right: 0,
        display: 'flex',
        justifyContent: 'end'
      }}>
        <Typography
          variant="caption"
          sx={{ pr: 1 }}
        >
          전체 진행률: {`${Math.round(nodeProgress)}%`}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={nodeProgress} />
        </Box>
      </Box>
    </Box>
  )
}
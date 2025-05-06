'use client'
import { Box } from '@mui/material';
import { ControllerChevron } from './container/ControllerChevron';
import { ReadingUnitExplorer } from './container/ReadingUnitExplorer';
import { ScrollContainer } from './container/ScrollContainer';
import { useTocContext } from './toc/toc-context';
import { useReaderStyleStore } from './use-reader-style-store';


const chevronTop = "42%";
const chevronHorizontalDistance = "6vw";

export const BookReader = () => {
  const { viewportWidth, viewportHeight } = useReaderStyleStore();
  const toc = useTocContext();

  return (
    <Box>
      <Box sx={{
        display: "flex",
        py: `${(100 - viewportHeight) / 2}vh`,
        px: `${(100 - viewportWidth) / 2}vw`,
        position: "relative"
      }}>
        <ControllerChevron direction='left' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
        <ScrollContainer>
          <ReadingUnitExplorer />
        </ScrollContainer>
        <ControllerChevron direction='right' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
      </Box>
    </Box>
  )
}
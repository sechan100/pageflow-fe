'use client'
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useTocContext } from '../model/context/toc-context';
import { createReadingUnitSequence } from '../model/reading-unit';
import { useReaderStyleStore } from '../model/stores/use-reader-style-store';
import { ContentLoader } from './ContentLoader';
import { ControllerChevron } from './ControllerChevron';
import { ReaderScrollContainer } from './ReaderScrollContainer';


const chevronTop = "42%";
const chevronHorizontalDistance = "6vw";

export const BookReader = () => {
  const { viewportWidth, viewportHeight } = useReaderStyleStore();
  const toc = useTocContext();

  useEffect(() => {
    const readingUnitSequence = createReadingUnitSequence(toc);
    console.log(readingUnitSequence.map((unit) => unit.headNode.title));
    // console.log(readingUnitSequence);
  }, [toc]);

  return (
    <Box>
      <Box sx={{
        display: "flex",
        py: `${(100 - viewportHeight) / 2}vh`,
        px: `${(100 - viewportWidth) / 2}vw`,
        position: "relative"
      }}>
        <ControllerChevron direction='left' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
        <ReaderScrollContainer>
          <ContentLoader />
        </ReaderScrollContainer>
        <ControllerChevron direction='right' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
      </Box>
    </Box>
  )
}
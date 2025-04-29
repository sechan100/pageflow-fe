'use client'
import { Box } from '@mui/material';
import { useTocContext } from '../model/context/toc-context';
import { useReaderStyleStore } from '../stores/use-reader-style-store';
import { ContentLoader } from './ContentLoader';
import { ControllerChevron } from './ControllerChevron';
import { ReaderScrollContainer } from './ReaderScrollContainer';


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
        <ReaderScrollContainer>
          <ContentLoader />
        </ReaderScrollContainer>
        <ControllerChevron direction='right' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
      </Box>
    </Box>
  )
}
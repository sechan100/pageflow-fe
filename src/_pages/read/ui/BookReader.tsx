'use client'
import { Box } from '@mui/material';
import { useBookContext } from "../model/book-context";
import { usePositionStore } from '../model/position';
import { ControllerChevron } from './ControllerChevron';
import { ReaderScrollContainer } from './ReaderScrollContainer';
import { VirtualTocNodeLoader } from './VirtualTocNodeLoader';


const chevronTop = "42%";
const chevronHorizontalDistance = "6vw";

export const BookReader = () => {
  const book = useBookContext();
  const position = usePositionStore(s => s.position);

  return (
    <Box>
      <Box sx={{
        display: "flex",
        py: "10vh",
        px: "15vw",
        position: "relative"
      }}>
        <ControllerChevron direction='left' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
        <ReaderScrollContainer>
          <VirtualTocNodeLoader />
        </ReaderScrollContainer>
        <ControllerChevron direction='right' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
      </Box>
    </Box>
  )
}
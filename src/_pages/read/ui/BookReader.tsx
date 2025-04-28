'use client'
import { Box } from '@mui/material';
import { useBookContext } from "../model/book-context";
import { ContentLoader } from './ContentLoader';
import { ControllerChevron } from './ControllerChevron';
import { ReaderScrollContainer } from './ReaderScrollContainer';


const chevronTop = "42%";
const chevronHorizontalDistance = "6vw";

export const BookReader = () => {
  const book = useBookContext();

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
          <ContentLoader />
        </ReaderScrollContainer>
        <ControllerChevron direction='right' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
      </Box>
    </Box>
  )
}
'use client'
import { Box } from '@mui/material';
import { useBookContext } from "../model/book-context";
import { usePositionStore } from '../model/position';
import { ControllerChevron } from './ControllerChevron';
import { FolderReaderWrapper } from './folder/FolderReaderWrapper';
import { SectionReaderWrapper } from './section/SectionReaderWrapper';


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
        {position.tocNodeType === "FOLDER" ? (<FolderReaderWrapper />) : (<SectionReaderWrapper />)}
        <ControllerChevron direction='right' top={chevronTop} horizontalDistance={chevronHorizontalDistance} />
      </Box>
    </Box>
  )
}
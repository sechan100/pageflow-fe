'use client'
import { Box } from '@mui/material';
import { useBookContext } from "../model/book-context";
import { usePositionStore } from '../model/position';
import { FolderDataProvider } from './folder/FolderDataProvider';
import { SectionDataProvider } from './section/SectionDataProvider';


export const BookReader = () => {
  const book = useBookContext();
  const position = usePositionStore(s => s.position);

  return (
    <Box sx={{
      pt: "100px",
      pl: "calc(374px / 2)",
    }}>
      {
        position.tocNodeType === "FOLDER" ? (
          <FolderDataProvider />
        ) : (
          <SectionDataProvider />
        )
      }
    </Box>
  )
}
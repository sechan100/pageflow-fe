'use client'
import { BookWithAuthor } from "@/entities/book";
import { Box, SxProps } from "@mui/material";
import { BookContextProvider } from "../model/book-context";
import { TocRoot } from "./TocRoot";
import { TocToolBar } from "./TocToolBar";


type Props = {
  book: BookWithAuthor;
  sx?: SxProps
}
export const TocTree = ({
  book,
  sx
}: Props) => {

  return (
    <BookContextProvider value={book}>
      <TocToolBar />
      <Box
        sx={{
          overflowY: "auto",
          height: "100%",
        }}
      >
        <TocRoot />
      </Box>
    </BookContextProvider>
  )
}
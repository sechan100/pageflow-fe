'use client'
import { BookStatus, BookWithAuthor } from "@/entities/book";
import { SxProps, Typography } from "@mui/material";
import { BookContextProvider } from "../model/book-context";



const mapStatusToText = (status: BookStatus) => {
  console.log(status);
  return status.toString();
}


type Props = {
  book: BookWithAuthor;
  sx?: SxProps;
}
export const BookStatusSetting = ({
  book,
  sx
}: Props) => {

  return (
    <BookContextProvider value={book}>
      <Typography>
        {mapStatusToText(book.status)}
      </Typography>
    </BookContextProvider>
  )
}
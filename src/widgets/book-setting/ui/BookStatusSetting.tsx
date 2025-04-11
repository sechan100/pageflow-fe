'use client'
import { AuthorPrivateBook, bookStatusConfig, BookStatusInfo } from "@/entities/book";
import { Grid, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { BookContextProvider } from "../model/book-context";
import { resolveStatusActions, StatusAction } from "../model/status-action";
import { BookStatusChangeButton } from "./BookStatusChangeButton";




type Props = {
  book: AuthorPrivateBook;
  sx?: SxProps;
}
export const BookStatusSetting = ({
  book,
  sx
}: Props) => {
  const statusInfo = useMemo<BookStatusInfo>(() => bookStatusConfig[book.status], [book.status]);
  const statusActions = useMemo<StatusAction[]>(() => resolveStatusActions(book.status), [book.status]);


  return (
    <BookContextProvider value={book}>
      <Typography sx={{ display: "inline" }} color={statusInfo.color}>
        <span style={{ color: "black" }}>현재 상태:&nbsp;</span>
        {statusInfo.text}
      </Typography>
      <Grid
        container
        columns={statusActions.length}
        direction="column"
      >
        {statusActions.map((changeable) => (
          <Grid
            key={changeable}
            size={1}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <BookStatusChangeButton
              action={changeable}
            />
          </Grid>
        ))}
      </Grid>
    </BookContextProvider>
  )
}
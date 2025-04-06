'use client'
import { BookWithAuthor } from "@/entities/book";
import { Grid, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";
import { bookStatusConfig } from "../config/book-status";
import { BookContextProvider } from "../model/book-context";
import { BookStatusInfo } from "../model/book-status";
import { resolveStatusActions, StatusAction } from "../model/status-action";
import { BookStatusChangeButton } from "./BookStatusChangeButton";




type Props = {
  book: BookWithAuthor;
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
      <Typography>
        현재 상태:&nbsp;
        <span style={{ color: statusInfo.color }}>
          {statusInfo.text}
        </span>
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
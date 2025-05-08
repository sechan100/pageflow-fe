'use client'
import { SxProps } from "@mui/material";
import { useRestoreReadingBookmark, useTraceReadingBookmark } from "./reading-bookmark";



type Props = {
  sx?: SxProps;
}
export const BookmarkConfiguration = ({
  sx
}: Props) => {
  useTraceReadingBookmark();
  useRestoreReadingBookmark();

  return (
    <>

    </>
  )
}
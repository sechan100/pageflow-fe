'use client'
import { BookStatus, bookStatusConfig } from "@/entities/book";
import { Chip, SxProps } from "@mui/material";


type Props = {
  status: BookStatus;
  sx?: SxProps;
}
export const BookStatusChip = ({
  status,
  sx
}: Props) => {

  return (
    <>
      <Chip
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
          zIndex: 1,
          boxShadow: "1px 1px 5px 2px rgba(0, 0, 0, 0.2)",
        }}
        label={bookStatusConfig[status].text}
        color={bookStatusConfig[status].color}
      />
    </>
  )
}
'use client'
import { BookWithAuthor } from "@/entities/book"
import { Box, SxProps } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getBookApi } from "../api/get-book"
import { sideDrawerWidth } from "../config/side-drawer-width"
import { BookStoreProvider } from "../model/use-book"
import { SideDrawer } from "./SideDrawer"



type Props = {
  bookId: string
  children: React.ReactNode
  sx?: SxProps
}
export const WritePageLayout = ({
  bookId,
  children,
  sx
}: Props) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookApi(bookId)
  });
  const [open, setOpen] = useState(true);

  if (isLoading) {
    return (<div>Loading...</div>)
  }
  if (isError) {
    return (<div>Error...</div>)
  }

  const book = data as BookWithAuthor;

  return (
    <BookStoreProvider
      data={book}
      onDataChange={(s, book) => s.setState({ book })}
    >
      <SideDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
      <Box
        sx={{
          marginLeft: open ? `${sideDrawerWidth}px` : 0,
          transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
        }}
      >
        {children}
      </Box>
    </BookStoreProvider >
  )
}
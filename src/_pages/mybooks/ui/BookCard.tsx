'use client'
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Box, Card, CardMedia, SxProps, Typography } from '@mui/material';
import { useCallback } from "react";
import { MyBook } from "../model/my-books";
import { BookStatusChip } from "./BookStatusChip";




const cardWidth = 170;
const cardHeight = cardWidth * 1.5;
const cardInfoHeight = 60;


const writeBookLink = (bookId: string) => `/write/${bookId}`
const bookReadLink = (bookId: string) => `/books/${bookId}`

type Props = {
  book: MyBook;
  sx?: SxProps
}
export const BookCard = ({
  book,
  sx
}: Props) => {
  const { router } = useNextRouter();

  // 책 상태에 따라서 적절한 링크로 이동시킨다.
  const dispatchBookLink = useCallback(() => {
    let link = null;
    switch (book.status) {
      case "DRAFT":
      case "REVISING":
        link = writeBookLink(book.id);
        break;
      case "PUBLISHED":
        link = bookReadLink(book.id);
        break;
      default:
        throw new Error(`Unknown book status: ${book.status}`);
    }
    router.push(link);
  }, [book.id, book.status, router]);

  return (
    <Card
      sx={{
        position: 'relative',
        width: cardWidth,
        height: cardHeight + cardInfoHeight,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
        },
        ...sx
      }}
      onClick={dispatchBookLink}
      elevation={3}
    >
      <BookStatusChip status={book.status} />
      <CardMedia
        component="img"
        height={cardHeight}
        image={book.coverImageUrl}
        alt={`${book.title} cover`}
        sx={{
          objectFit: 'cover',
        }}
      />
      <Box
        sx={{
          borderTop: '1px solid #ccc',
          p: 1
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {book.title}
        </Typography>
      </Box>
    </Card>
  );
};
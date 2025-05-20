'use client'
import { PALLETTE } from "@/global/styles";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Box, Card, CardMedia, SxProps, Typography } from "@mui/material";
import { useCallback } from "react";
import { PublishedListBook } from "../model/published-list-book";

const cardWidth = 170;
const cardHeight = cardWidth * 1.5;

const bookReadLink = (bookId: string) => `/books/${bookId}`

type BookInfoCardProps = {
  book: PublishedListBook;
  sx?: SxProps;
}
const BookInfoCard = ({
  book,
  sx
}: BookInfoCardProps) => {

  return (
    <Box sx={{
      pt: "2px",
    }}>
      <Typography
        variant="subtitle2"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {book.title}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: PALLETTE.secondary,
        }}
      >
        {book.author.penname}
      </Typography>
    </Box>
  )
}

type BookCardProps = {
  book: PublishedListBook;
};
export const BookCard = ({ book }: BookCardProps) => {
  const { router } = useNextRouter();

  const dispatchBookLink = useCallback(() => {
    const link = bookReadLink(book.id);
    router.push(link);
  }, [book.id, router]);

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          width: cardWidth,
          height: cardHeight,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          cursor: 'pointer',
          borderRadius: 2,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
        onClick={dispatchBookLink}
        elevation={3}
      >
        <CardMedia
          component="img"
          height={cardHeight}
          image={book.coverImageUrl}
          alt={`${book.title} cover`}
          sx={{
            objectFit: 'cover',
          }}
        />
      </Card>
      <BookInfoCard book={book} />
    </>
  );
};
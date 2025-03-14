'use client'
import { Book } from "@/entities/book";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Box, Card, CardMedia, SxProps, Typography } from '@mui/material';




const cardWidth = 170;
const cardHeight = cardWidth * 1.5;
const cardInfoHeight = 60;


const writeBookLink = (bookId: string) => `/write/${bookId}`

type Props = {
  book: Book;
  sx?: SxProps
}
export const BookCard = ({
  book,
  sx
}: Props) => {
  const { router } = useNextRouter();

  return (
    <Card
      sx={{
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
      onClick={() => router.push(writeBookLink(book.id))}
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
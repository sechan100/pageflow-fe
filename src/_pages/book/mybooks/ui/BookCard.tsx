'use client'
import { Book } from "@/entities/book"
import { SxProps } from "@mui/material"
import { Card, CardContent, CardMedia, Typography } from '@mui/material';



type Props = {
  book: Book;
  sx?: SxProps
}
export const BookCard = ({
  book,
  sx
}: Props) => {
  return (
    <Card
      sx={{
        maxWidth: 280,
        height: 380,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
        },
        ...sx
      }}
      elevation={3}
    >
      <CardMedia
        component="img"
        height="280"
        image={book.coverImageUrl}
        alt={`${book.title} cover`}
        sx={{
          objectFit: 'cover',
        }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
          }}
        >
          {book.title}
        </Typography>
      </CardContent>
    </Card>
  );
};
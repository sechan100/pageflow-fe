'use client';

import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Typography } from "@mui/material";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { usePublishedBookContext } from "../model/published-book-context";
import { SectionHeader } from "./utils/SectionHeader";
import { SectionPaper } from "./utils/SectionPaper";

export const AuthorProfile = () => {
  const {
    id: bookId,
    authorProfile: {
      penname,
      profileImageUrl,
      bio,
      books,
    }
  } = usePublishedBookContext();

  const otherBooks = books.filter(b => b.id !== bookId);
  const previewBooks = useMemo(() => otherBooks.slice(0, 5), [otherBooks]);
  const remainingBooksCount = otherBooks.length - previewBooks.length;

  return (
    <SectionPaper>
      <SectionHeader title="작가 소개" />

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
        <Avatar
          src={profileImageUrl}
          alt={penname}
          sx={{
            width: 120,
            height: 120,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">{penname}</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <BookOpen size={16} />
            {books.length}권의 작품 저자
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {bio || "작가 소개가 아직 등록되지 않았습니다."}
          </Typography>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 4,
                textTransform: 'none'
              }}
              endIcon={<ArrowRight size={16} />}
            >
              모든 작품 보기
            </Button>
          </Box>
        </Box>
      </Box>

      {previewBooks.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {penname} 작가의 다른 작품
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                '::-webkit-scrollbar': {
                  height: '6px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '6px',
                }
              }}
            >
              {previewBooks.map((book) => (
                <Card
                  key={book.id}
                  sx={{
                    minWidth: 160,
                    maxWidth: 160,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200 }}>
                    {book.coverImageUrl ? (
                      <Image
                        src={book.coverImageUrl}
                        alt={book.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: '100%',
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <BookOpen color="gray" />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="subtitle2"
                      noWrap
                      title={book.title}
                    >
                      {book.title}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {remainingBooksCount > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 160,
                    backgroundColor: 'background.paper',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Chip
                    label={`+ ${remainingBooksCount}권 더보기`}
                    clickable
                    sx={{ borderRadius: 4 }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </SectionPaper>
  );
};

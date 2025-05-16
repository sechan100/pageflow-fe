'use client';

import { Review } from '@/entities/book';
import { Box } from "@mui/material";
import { uniqueId } from 'lodash';
import { BookIdContextProvider } from '../model/context';
import { InitReviewsStoreConfig } from '../model/use-reviews-store';
import { ReviewList } from './ReviewList';
import { ReviewSummary } from './ReviewSummary';


// 샘플 리뷰 데이터
const dummyReviews: Review[] = [
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '전서윤',
      profileImageUrl: 'https://example.com/profile.jpg',
    },
    score: 5,
    createdAt: [2023, 12, 12, 10, 30, 0, 970366000],
    updatedAt: [2023, 12, 12, 10, 30, 0, 970366000],
    content: '이 책은 정말 통찰력 있고 잘 쓰여졌어요. 손에서 내려놓을 수 없었습니다! 저자는 복잡한 개념을 쉽게 접근할 수 있게 하는 필력이 있습니다.'
  },
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '최세빈',
      profileImageUrl: 'https://example.com/profile2.jpg',
    },
    score: 4,
    createdAt: [2023, 11, 15, 14, 0, 0, 970366000],
    updatedAt: [2023, 11, 15, 14, 0, 0, 970366000],
    content: '전반적으로 훌륭한 책입니다. 일부분은 조금 지루했지만, 주요 주제들은 강력하고 생각을 자극시키는 내용이었습니다.'
  },
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '장예진',
      profileImageUrl: 'https://example.com/profile8.jpg',
    },
    score: 3,
    createdAt: [2023, 11, 5, 9, 0, 0, 970366000],
    updatedAt: [2023, 11, 5, 9, 0, 0, 970366000],
    content: '괜찮은 책이지만, 기대했던 것만큼은 아니었습니다.'
  },
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '김연우',
      profileImageUrl: 'https://example.com/profile3.jpg',
    },
    score: 4,
    createdAt: [2023, 11, 2, 16, 0, 0, 970366000],
    updatedAt: [2023, 11, 2, 16, 0, 0, 970366000],
    content: '책이 좋긴 하지만, 기대했던 것만큼은 아니었습니다. 몇몇 부분은 더 깊이 있는 논의가 필요했어요.'
  },
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '남하은',
      profileImageUrl: 'https://example.com/profile4.jpg',
    },
    score: 4,
    createdAt: [2023, 11, 1, 12, 0, 0, 970366000],
    updatedAt: [2023, 11, 1, 12, 0, 0, 970366000],
    content: '솔직히 실망스러웠습니다. 내용이 너무 얕고, 저자의 주장이 설득력이 없었습니다.'
  },
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '이유리',
      profileImageUrl: 'https://example.com/profile5.jpg',
    },
    score: 1,
    createdAt: [2023, 10, 30, 18, 0, 0, 970366000],
    updatedAt: [2023, 10, 30, 18, 0, 0, 970366000],
    content: '이 책은 정말 읽기 힘들었습니다. 내용이 산만하고, 저자의 주장이 일관성이 없었습니다.'
  },
  {
    id: uniqueId(),
    writer: {
      id: uniqueId(),
      penname: '이보람',
      profileImageUrl: 'https://example.com/profile6.jpg',
    },
    score: 5,
    createdAt: [2023, 10, 28, 20, 0, 0, 970366000],
    updatedAt: [2023, 10, 28, 20, 0, 0, 970366000],
    content: '정말 훌륭한 책입니다! 저자의 통찰력이 돋보이고, 읽는 내내 흥미로웠습니다.'
  },
];

type Props = {
  bookId: string;
  reviews: Review[];
}
export const ReviewWidget = ({
  bookId,
  reviews
}: Props) => {

  return (
    <BookIdContextProvider value={bookId}>
      <InitReviewsStoreConfig reviews={reviews} />
      <Box>
        {/* 리뷰 통계 */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: "center",
          justifyContent: 'space-between',
          mb: 4,
          gap: 3,
          pb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <ReviewSummary />
        </Box>
        <ReviewList />
      </Box>
    </BookIdContextProvider>
  );
};

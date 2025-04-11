'use client';

import { STYLES } from '@/global/styles';
import { Stack } from "@mui/material";
import { useMemo } from 'react';

const BookIcon = ({ color, size }: { color: string, size: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{
    margin: '0 2px',
  }}>
    <path
      fill={color}
      d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.41.21.75-.19.75-.45V6c-1.49-1.12-3.63-1.5-5.5-1.5z"
    />
    <path
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="0.5"
      strokeLinecap="round"
      d="M12 6v14"
    />
  </svg>
);

type Props = {
  score: number;
  size?: number;
}
export const BookReviewRating = ({
  score,
  size = 20,
}: Props) => {
  // 평점을 반올림하여 정수로 표시
  const roundedScore = useMemo(() => Math.round(score), [score]);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {Array.from({ length: 5 }).map((_, index) => (
        <BookIcon
          key={index}
          color={index < roundedScore ? STYLES.color.primary : STYLES.color.disabled}
          size={size}
        />
      ))}
    </Stack>
  );
};

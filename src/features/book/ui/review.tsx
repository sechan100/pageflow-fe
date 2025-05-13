'use client';

import { STYLES } from "@/global/styles";
import { Stack, SvgIcon, SxProps } from "@mui/material";


export type ReviewScoreIconStackProps = {
  renderScoreIcon: (index: number) => ReviewScoreIconProps;
  sx?: SxProps;
}
export const ReviewScoreIconStack = ({ renderScoreIcon, sx }: ReviewScoreIconStackProps) => {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={sx}>
      {Array.from({ length: 5 }).map((_, index) => (
        <ReviewScoreIcon
          key={index}
          {...renderScoreIcon(index)}
        />
      ))}
    </Stack>
  )
}


export type BookReviewRatingProps = {
  // 소숫점 1자리까지 표현
  score: number;
  size?: "small" | "medium" | "large";
}
export const BookReviewRating = ({ score, size }: BookReviewRatingProps) => {
  return (
    <ReviewScoreIconStack renderScoreIcon={(index) => {
      const left = index < score;
      const right = index + 1 <= score;
      return {
        left,
        right,
        size,
      }
    }} />
  );
};


export type ReviewScoreIconProps = {
  left: boolean;
  right: boolean;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  sx?: SxProps;
};
export const ReviewScoreIcon = ({ left, right, size = "medium", onClick, sx }: ReviewScoreIconProps) => {

  return (
    <SvgIcon
      viewBox="0 0 24 24"
      fontSize={size}
      onClick={onClick}
      sx={sx}
    >
      {/* 왼쪽 페이지 */}
      <path
        fill={left ? STYLES.color.primary : STYLES.color.disabled}
        d="M12 5v15.5c-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-3.21.22-4.75.93-.37.18-.75-.04-.75-.43V6c1.11-1.03 3.08-1.5 5.5-1.5 1.95 0 4.05.4 5.5 1.5z" />
      {/* 중앙선 */}
      <path
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeLinecap="round"
        d="M12 5v15.5" />
      {/* 오른쪽 페이지 */}
      <path
        fill={right ? STYLES.color.primary : STYLES.color.disabled}
        d="M12 5v15.5c1.45-1.1 3.55-1.5 5.5-1.5 1.45 0 3.21.22 4.75.93.37.18.75-.04.75-.43V6c-1.11-1.03-3.08-1.5-5.5-1.5-1.95 0-4.05.4-5.5 1.5z" />
    </SvgIcon>
  );
};


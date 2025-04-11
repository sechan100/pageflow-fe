'use client'
import { convertToLocalDateTime } from "@/shared/local-date-time";
import { Box, SxProps, Typography } from "@mui/material";
import { convertEditionToText } from "../model/convert-edition-to-text";
import { PublishedRecord } from "../model/published-book";






type Props = {
  publishedRecords: PublishedRecord[];
  sx?: SxProps;
}
export const PublishedRecoredsSection = ({
  publishedRecords,
  sx
}: Props) => {

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 'bold',
          mb: 2,
        }}
        variant="body2"
        color="textPrimary"
      >
        출간일
      </Typography>
      {publishedRecords.map(({ edition, printingCount, publishedAt }) => {
        const { year, month, day } = convertToLocalDateTime(publishedAt);
        return (
          <Typography
            key={edition}
            variant="body1"
            color="textSecondary"
          >
            {year}년 {month}월 {day}일 {convertEditionToText(edition)} {printingCount}쇄
          </Typography>
        )
      })}
    </Box>
  )
}
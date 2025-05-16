'use client'
import { PublishedRecord } from '@/entities/book';
import { LocalDateTimeService } from "@/shared/local-date-time";
import { SxProps, Typography } from "@mui/material";
import { convertEditionToText } from "../model/convert-edition-to-text";
import { Section, Title } from "./utils/book-info-section";

type Props = {
  publishedRecords: PublishedRecord[];
  sx?: SxProps;
}
export const PublishedRecoredsSection = ({
  publishedRecords,
  sx
}: Props) => {

  return (
    <Section>
      <Title>
        출간일
      </Title>
      {publishedRecords.map(({ edition, printingCount, publishedAt }) => {
        const { year, month, day } = LocalDateTimeService.convert(publishedAt);
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
    </Section>
  )
}
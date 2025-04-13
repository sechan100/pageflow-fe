import { InfoOutlined } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import { BookInfo } from "./utils/book-info-section";


const charCountPerPage = 700;
const tooltipText = `한 페이지에 약 ${charCountPerPage}자 인 신국판(152X225mm)을 기준으로 산정한 값입니다.`;
const getPageCount = (charCount: number) => {
  return Math.ceil(charCount / charCountPerPage);
}

type CharacterCountSectionProps = {
  charCount: number;
}
export const CharacterCountSection = ({
  charCount,
}: CharacterCountSectionProps) => {
  return (
    <BookInfo.Section>
      <BookInfo.Title>
        분량
      </BookInfo.Title>
      <Typography variant="body1" color="text.secondary">
        페이지 수
        : {getPageCount(charCount)}p&nbsp;
        <Tooltip title={tooltipText} arrow placement="top">
          <InfoOutlined
            color="action"
            sx={{
              fontSize: '14px',
              opacity: 0.7,
              '&:hover': { opacity: 1 }
            }}
          />
        </Tooltip>
      </Typography>
      <Typography variant="body1" color="text.secondary">
        글자 수: {charCount} 자
      </Typography>
    </BookInfo.Section>
  );
};

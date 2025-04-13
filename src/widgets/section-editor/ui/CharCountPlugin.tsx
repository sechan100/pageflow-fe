'use client'
import { Box, Stack, SxProps } from "@mui/material";
import { useSectionCharCount } from "../model/use-section-char-count";



type Props = {
  sx?: SxProps;
}
export const CharCountPlugin = ({
  sx
}: Props) => {
  const { charCount } = useSectionCharCount();

  return (
    <>
      <Stack
        direction="row"
        justifyContent="end"
      >
        <Box sx={{
          fontSize: '12px',
        }}>
          현재 섹션 글자수: {charCount}자
        </Box>
      </Stack>
    </>
  )
}
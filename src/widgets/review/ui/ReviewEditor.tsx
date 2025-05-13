'use client'
import { ReviewScoreIconProps, ReviewScoreIconStack } from '@/features/book';
import { STYLES } from "@/global/styles";
import { createPlainTextEditorStore, PlainTextEditor, PlainTextEditorStoreApi } from "@/shared/ui/PlainTextEditor";
import { Paper, SxProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";


type ReviewScoreSelectorProps = {
  score: number;
  onScoreChange: (score: number) => void;
  sx?: SxProps;
}
const ReviewScoreSelector = ({ score, onScoreChange, sx }: ReviewScoreSelectorProps) => {

  const renderScoreIcon = useCallback<(index: number) => ReviewScoreIconProps>((index) => {
    const shouldHighlight = index < score;
    return {
      left: shouldHighlight,
      right: shouldHighlight,
      onClick: () => {
        onScoreChange(index + 1);
      },
      sx: {
        cursor: 'pointer',
      }
    }
  }, [onScoreChange, score]);

  return (
    <>
      <ReviewScoreIconStack sx={sx} renderScoreIcon={renderScoreIcon} />
    </>
  )
}


type Props = {
  html: string;
  sx?: SxProps;
}
export const ReviewEditor = ({
  html,
  sx
}: Props) => {
  const storeRef = useRef<PlainTextEditorStoreApi>(createPlainTextEditorStore({
    editorName: 'review-editor',
    initialHtml: html,
  }));
  const [score, setScore] = useState(5);

  const handleScoreChange = useCallback((newScore: number) => {
    console.log('new score', newScore);
    setScore(newScore);
  }, []);

  useEffect(() => {
    storeRef.current.getState().registerSaveListener(content => {
      console.log('content', content);
    });
  }, []);

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 2,
          backgroundColor: STYLES.color.background,
          borderRadius: 2
        }}
      >
        <ReviewScoreSelector
          score={score}
          onScoreChange={handleScoreChange}
          sx={{
            mb: 2,
          }}
        />
        <PlainTextEditor store={storeRef.current} />
      </Paper>
    </>
  )
}
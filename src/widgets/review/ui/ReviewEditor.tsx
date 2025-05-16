'use client'
import { Review } from '@/entities/book';
import { ReviewScoreIconProps, ReviewScoreIconStack } from '@/features/book';
import { useNotification } from '@/shared/ui/notification';
import { createPlainTextEditorStore, PlainTextEditor, PlainTextEditorStoreApi } from "@/shared/ui/PlainTextEditor";
import { Button, Stack, SxProps } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { createReviewApi } from '../api/create-review';
import { updateReviewApi } from '../api/update-review';
import { useBookIdContext } from '../model/context';
import { useReviewsStoreActions } from '../model/use-reviews-store';


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
  review: Review | null;
  onSave?: () => void;
  sx?: SxProps;
}
export const ReviewEditor = ({
  review,
  onSave,
  sx
}: Props) => {
  const bookId = useBookIdContext();
  const notification = useNotification();
  const { addReview, updateReview } = useReviewsStoreActions();

  const storeRef = useRef<PlainTextEditorStoreApi>(createPlainTextEditorStore({
    editorName: 'review-editor',
    initialHtml: review?.content ?? null,
    placeholder: '리뷰를 작성해주세요.',
  }));

  const [score, setScore] = useState(review?.score ?? 5);
  const [canSave, setCanSave] = useState(false);

  // canSave 동기화
  useEffect(() => {
    const checkCanSave = (newHtml: string) => {
      const { isHtmlEmpty, initialHtml } = storeRef.current.getState();
      if (isHtmlEmpty) {
        setCanSave(false);
        return;
      }
      const isScoreChanged = review !== null ? score !== review.score : true;
      const isHtmlChanged = newHtml !== initialHtml;
      setCanSave(isHtmlChanged || isScoreChanged);
    }

    // score와 html 동기화
    checkCanSave(storeRef.current.getState().html);
    // html과 canSave 동기화
    const unsubscribe = storeRef.current.subscribe(s => s.html, checkCanSave);
    return () => unsubscribe();
  }, [review, score]);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const save = useCallback(async () => {
    if (!canSave) {
      throw new Error("Cannot save");
    }
    const { html } = storeRef.current.getState();
    if (review === null) {
      const res = await createReviewApi({ bookId, content: html, score });
      if (!res.isSuccess) {
        notification.error();
        return;
      }
      addReview(res.data);
      notification.success("리뷰가 등록되었습니다.");
    }
    else {
      const res = await updateReviewApi({ bookId, reviewId: review.id, content: html, score });
      if (!res.isSuccess) {
        notification.error();
        return;
      }
      updateReview(review.id, r => {
        return res.data;
      });
      notification.success("리뷰가 수정되었습니다.");
    }
    onSave?.();
  }, [addReview, bookId, canSave, notification, onSave, review, score, updateReview]);

  return (
    <>
      <ReviewScoreSelector
        score={score}
        onScoreChange={handleScoreChange}
        sx={{
          mb: 2,
        }}
      />
      <PlainTextEditor store={storeRef.current} />
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant='contained'
          disabled={!canSave}
          onClick={save}
        >
          리뷰 등록
        </Button>
      </Stack>
    </>
  )
}
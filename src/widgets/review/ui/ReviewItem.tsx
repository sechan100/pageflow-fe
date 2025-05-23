'use client'
import { Review } from "@/entities/book";
import { useSessionQuery } from "@/entities/user";
import { BookReviewRating } from "@/features/book";
import { STYLES } from "@/global/styles";
import { LocalDateTimeService } from "@/shared/local-date-time";
import { useNotification } from "@/shared/ui/notification";
import { createPlainTextEditorStore, PlainTextEditor, PlainTextEditorStoreApi } from "@/shared/ui/PlainTextEditor";
import { useDialog } from "@/shared/ui/use-dialog";
import { AlignBox } from "@/shared/ui/AlignBox";
import { Avatar, Box, IconButton, Stack, SxProps, Typography } from "@mui/material";
import { Edit, RotateCcw, Trash } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { deleteReviewApi } from "../api/delete-review";
import { useBookIdContext } from "../model/context";
import { useReviewsStoreActions } from "../model/use-reviews-store";
import { ReviewBox } from "./ReviewBox";
import { ReviewEditor } from "./ReviewEditor";


type ReviewDateProps = {
  review: Review;
}
const ReviewDate = ({
  review,
}: ReviewDateProps) => {
  const createdAt = useMemo(() => LocalDateTimeService.convert(review.createdAt), [review.createdAt]);
  const updatedAt = useMemo(() => LocalDateTimeService.convert(review.updatedAt), [review.updatedAt]);

  const printDate = useCallback((dateType: "createdAt" | "updatedAt") => {
    const date = dateType === "createdAt" ? createdAt : updatedAt;
    return `${date.year}년 ${date.month}월 ${date.day}일`;
  }, [createdAt, updatedAt]);

  return (
    <>
      <Typography variant="caption" sx={{ ml: 1 }}>
        {/* {equalLocalDateTime(createdAt, updatedAt) ? printDate("createdAt") : `${printDate("updatedAt")} (수정됨)`} */}
        {printDate("createdAt")}
      </Typography>
    </>
  )
}

type ReviewContentProps = {
  review: Review;
}
const ReviewContent = ({ review }: ReviewContentProps) => {
  const storeRef = useRef<PlainTextEditorStoreApi>(createPlainTextEditorStore({
    editorName: 'review-viewer',
    initialHtml: review.content,
    readOnly: true,
  }));

  return (
    <>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <AlignBox sx={{ mr: 1 }}>
          <Avatar src={review.writer.profileImageUrl} />
        </AlignBox>
        {/* <Avatar sx={{ mr: 2 }}>{review.writer.penname.charAt(0)}</Avatar> */}
        <Box>
          <Typography variant="subtitle1">{review.writer.penname}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BookReviewRating score={review.score} />
            <ReviewDate review={review} />
          </Box>
        </Box>
      </Box>
      <PlainTextEditor store={storeRef.current} />
    </>
  )
}


type Props = {
  review: Review;
  sx?: SxProps;
}
export const ReviewItem = ({
  review,
  sx
}: Props) => {
  const sessionQuery = useSessionQuery();
  const bookId = useBookIdContext();
  const { confirm } = useDialog();
  const notification = useNotification();
  const { removeReview } = useReviewsStoreActions();

  const [editMode, setEditMode] = useState(false);
  const isReviewOwnedByCurrentUser = useMemo<boolean>(() => {
    if (sessionQuery.data === undefined) return false;
    const uid = sessionQuery.data.user.uid;
    return review.writer.id === uid;
  }, [review.writer.id, sessionQuery.data]);

  const handleDelete = useCallback(async () => {
    const deletion = await confirm("정말 리뷰를 삭제하시겠습니까?", {
      title: "리뷰 삭제",
      okText: "삭제",
      cancelText: "취소",
      severity: "error"
    });
    if (!deletion) return;
    await deleteReviewApi({
      bookId,
      reviewId: review.id
    });
    removeReview(review.id);
    notification.success("리뷰가 삭제되었습니다.");
  }, [bookId, confirm, notification, removeReview, review.id]);

  return (
    <ReviewBox sx={{
      position: 'relative',
    }}>
      {isReviewOwnedByCurrentUser && (
        <Stack
          direction="row"
          justifyContent="end"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setEditMode(!editMode)}
          >
            {!editMode ? <Edit /> : <RotateCcw />}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
          >
            <Trash color={STYLES.color.danger} />
          </IconButton>
        </Stack>
      )}
      {editMode ? <ReviewEditor review={review} onSave={() => setEditMode(false)} /> : <ReviewContent review={review} />}
    </ReviewBox>
  )
}
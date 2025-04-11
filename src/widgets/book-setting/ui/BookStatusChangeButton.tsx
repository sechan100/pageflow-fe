'use client'
import { AuthorPrivateBook } from "@/entities/book";
import { useNotification } from "@/shared/ui/notification";
import { useDialog } from "@/shared/ui/use-dialog";
import { Box, Button, Checkbox, Dialog, Divider, FormControlLabel, Paper, SxProps, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBookStatusMutation } from "../api/change-book-status";
import { bookStatusChangeDescription, dontRiseEditionDescription } from "../config/book-status-change-description";
import { statusActionConfig } from "../config/status-action";
import { useBookContext } from "../model/book-context";
import { resolveServerStatusActionCmd, StatusAction } from "../model/status-action";

type StatusActionColor = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

const statusActionColors: Record<StatusAction, StatusActionColor> = {
  publish: "primary",
  "start-revision": "primary",
  revise: "primary",
  "cancel-resivion": "error",
}

const statusSimpleNames: Record<StatusAction, string> = {
  publish: "출판",
  "start-revision": "개정을 시작",
  revise: "개정",
  "cancel-resivion": "개정을 취소",
}

const createActionSuccessMessages: (book: AuthorPrivateBook) => Record<StatusAction, string> = (book) => ({
  publish: `"'${book.title}'"이(가) 출판되었습니다.`,
  "start-revision": "개정을 시작했습니다.",
  revise: `"'${book.title}'"이(가) 개정되었습니다.`,
  "cancel-resivion": "개정이 취소되었습니다.",
})

/**
 * 상태 변경 시 두번 확인 다이얼로그가 필요한 액션
 */
const doubleConfirmRequredActions: StatusAction[] = [
  "revise",
  "cancel-resivion",
]

/**
 * 기본적으로 개정할 때 판본을 올릴지 여부
 */
const defaultDontRiseEdition = false;

type StatusChangeDialogProps = {
  action: StatusAction;
  open: boolean;
  onClose: () => void;
  sx?: SxProps;
}
const StatusChangeDialog = ({
  action,
  open,
  onClose,
  sx
}: StatusChangeDialogProps) => {
  const { confirm: openConfirmDialog } = useDialog();
  const notification = useNotification();
  const book = useBookContext();
  const { mutateAsync: changeBookStatus } = useBookStatusMutation(book.id);
  const statusActionSuccessMessages = useMemo(() => createActionSuccessMessages(book), [book]);

  // StatusAction이 "revise"인 경우에만 dontRiseEdition 체크박스가 보임
  const dontRiseEditionRef = useRef<boolean>(defaultDontRiseEdition);
  // dialog가 열릴 때마다 dontRiseEditionRef를 초기화
  useEffect(() => {
    if (open) {
      dontRiseEditionRef.current = defaultDontRiseEdition;
    }
  }, [open])

  const handleConfirm = useCallback(async () => {
    let confirm = true;

    // 재확인이 필요한 액션인 경우만 확인 다이얼로그를 띄움
    if (doubleConfirmRequredActions.includes(action)) {
      confirm = await openConfirmDialog(`정말 ${statusSimpleNames[action]}하시겠습니까?`, {
        okText: "확인",
        cancelText: "취소",
      })
    }
    if (!confirm) return;

    const cmd = resolveServerStatusActionCmd({
      action,
      dontRiseEdition: action === "revise" ? dontRiseEditionRef.current : undefined,
    });
    const res = await changeBookStatus(cmd);
    if (res.success) {
      notification.success(statusActionSuccessMessages[action]);
    } else {
      notification.error(res.message);
    }
  }, [action, changeBookStatus, dontRiseEditionRef, notification, openConfirmDialog, statusActionSuccessMessages]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx
      }}
    >
      <Paper
        sx={{
          px: 5,
          py: 3,
        }}
      >
        <Typography variant="h4">{statusActionConfig[action].text}</Typography>
        <Divider sx={{ mt: 1, mb: 4 }} />
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: bookStatusChangeDescription[action] }}
        />
        {action === "revise" && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={defaultDontRiseEdition}
                  onChange={e => dontRiseEditionRef.current = e.target.checked}
                />
              }
              label={dontRiseEditionDescription}
              slotProps={{
                typography: {
                  variant: 'body2',
                  sx: {
                    fontSize: '0.8em',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }
                }
              }}
            />
          </Box>
        )}
        {/* 확인, 취소 버튼 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            mt: 3,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              handleConfirm();
              onClose();
            }}
            sx={{
              py: 1.2,
            }}
          >
            확인
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={onClose}
          >
            취소
          </Button>
        </Box>
      </Paper>
    </Dialog >
  )
}

type Props = {
  action: StatusAction;
  sx?: SxProps;
}
export const BookStatusChangeButton = ({
  action,
  sx
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        color={statusActionColors[action]}
        onClick={() => setOpen(true)}
      >
        {statusActionConfig[action].text}
      </Button>
      <StatusChangeDialog
        action={action}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
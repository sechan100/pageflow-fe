import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { useCallback } from "react";



type SingleTextFieldModalProps = {
  open: boolean;
  onClose: () => void;
  modalTitle: string;
  fieldComponent: React.ReactNode;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
}
export const SingleTextFieldModal = ({
  open,
  onClose,
  modalTitle,
  fieldComponent,
  onSubmit,
  submitText = '완료',
  cancelText = '취소',
  submitDisabled,
}: SingleTextFieldModalProps) => {

  // 생성 버튼 클릭
  const handleSubmit = useCallback(() => {
    onSubmit();
    onClose();
  }, [onClose, onSubmit]);


  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {modalTitle}
        </Typography>
        {fieldComponent}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => onClose()}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitDisabled !== undefined ? submitDisabled : false}
          >
            {submitText}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
'use client'

import { Field } from "@/shared/field";
import { InputAdornment, SxProps, TextField } from "@mui/material";
import { useCallback } from "react";
// import { useApplicationProperties } from "@/global/properties";
import { fieldMarginY } from "@/shared/ui/field-margin-y";
import { useFieldOnSaveMode } from "@/shared/ui/use-field-on-save-mode";
import { PencilLine } from "lucide-react";


type Props = {
  title: Field;
  onChange: (field: Field) => void;
  /**
   * 해당 property를 활성화하면, 저장 버튼과 enter 단축키가 활성화
   */
  onSave?: (title: string) => void;
  saveDisabled?: boolean;
  lable?: string;
  fieldName?: string;
  sx?: SxProps;
}
export const BookTitleField = ({
  title,
  onChange,
  onSave,
  saveDisabled,
  lable = '제목',
  fieldName = 'title',
  sx
}: Props) => {
  // const {} = useApplicationProperties();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    let newError: string | null = null;
    if (newTitle.length < 1) {
      newError = '제목을 입력해주세요.';
    } else {
      newError = null;
    }
    onChange({ value: newTitle, error: newError });
  }, [onChange]);

  const save = useCallback(() => {
    if (onSave === undefined) {
      return;
    }
    if (title.error) {
      return;
    }
    onSave(title.value);
  }, [onSave, title.error, title.value]);

  const { inputSlotProps } = useFieldOnSaveMode({
    onSave: save,
    saveDisabled: saveDisabled !== undefined ? saveDisabled : false,
  });

  return (
    <>
      <TextField
        name={fieldName}
        label={lable}
        type="text"
        variant={onSave !== undefined ? 'standard' : 'outlined'}
        value={title.value}
        onChange={handleChange}
        error={!!title.error}
        helperText={title.error}
        sx={{
          my: fieldMarginY,
          ...sx
        }}
        fullWidth
        slotProps={{
          input: {
            ...(onSave !== undefined ? inputSlotProps : {
              startAdornment: (
                <InputAdornment position="start">
                  <PencilLine />
                </InputAdornment>
              )
            })
          }
        }}
      />
    </>
  )
}
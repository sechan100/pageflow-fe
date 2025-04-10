'use client'

import { Field } from "@/shared/field";
import { InputAdornment, SxProps, TextField } from "@mui/material";
import { useCallback } from "react";
// import { useApplicationProperties } from "@/global/properties";
import { validateNodeTitle } from '@/features/book';
import { fieldMarginY } from "@/shared/ui/field-margin-y";
import { PencilLine } from "lucide-react";


type Props = {
  title: Field;
  onChange: (field: Field) => void;
  lable?: string;
  fieldName?: string;
  sx?: SxProps;
}
export const CreateNodeTitleField = ({
  title,
  onChange,
  lable = '제목',
  fieldName = 'title',
  sx
}: Props) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newError = validateNodeTitle(newTitle);
    onChange({ value: newTitle, error: newError });
  }, [onChange]);

  return (
    <>
      <TextField
        name={fieldName}
        label={lable}
        inputRef={(ref: HTMLInputElement) => {
          if (!ref) return;
          ref.focus();
        }}
        type="text"
        variant="outlined"
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
            startAdornment: (
              <InputAdornment position="start">
                <PencilLine />
              </InputAdornment>
            )
          }
        }}
      />
    </>
  )
}
'use client'
import { useApplicationProperties } from "@/global/properties"
import { Field } from "@/shared/field"
import { InputAdornment, SxProps, TextField } from "@mui/material"
import { Pencil } from "lucide-react"
import { useCallback } from "react"
import { fieldMarginY } from "./field-margin-y"



type Props = {
  penname: Field;
  onChange: (field: Field) => void;
  lable?: string;
  fieldName?: string;
  sx?: SxProps
}
export const PennameField = ({
  penname,
  onChange,
  lable = '필명',
  fieldName = 'penname',
  sx
}: Props) => {
  const {
    user: {
      pennameMinLength,
      pennameMaxLength,
      pennameRegex,
      pennameRegexMessage,
    }
  } = useApplicationProperties();

  const handlePennameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPenname = e.target.value;

    let newError: string | null = null;
    if (pennameMinLength > newPenname.length) {
      newError = `필명은 ${pennameMinLength}자 이상이어야 합니다.`;

    } else if (pennameMaxLength < newPenname.length) {
      newError = `필명은 ${pennameMaxLength}자 이하여야 합니다.`;

    } else if (!new RegExp(pennameRegex).test(newPenname)) {
      newError = pennameRegexMessage;

    } else {
      newError = null;
    }
    onChange({ value: newPenname, error: newError });
  }, [onChange, pennameMaxLength, pennameMinLength, pennameRegex, pennameRegexMessage]);


  return (
    <TextField
      name={fieldName}
      label={lable}
      type="text"
      variant="outlined"
      value={penname.value}
      onChange={handlePennameChange}
      error={!!penname.error}
      helperText={penname.error}
      sx={{
        my: fieldMarginY,
        ...sx
      }}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Pencil />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
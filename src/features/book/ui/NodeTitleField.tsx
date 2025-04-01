'use client'

import { Box, Button, SxProps, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
// import { useApplicationProperties } from "@/global/properties";
import { fieldMarginY } from "@/shared/components/field-margin-y";
import { Field } from "@/shared/field";
import { validateNodeTitle } from "../model/validate-node-title";


type Props = {
  title: string;
  onSave: (title: string) => void;
  sx?: SxProps;
}
export const NodeTitleField = ({
  title,
  onSave,
  sx
}: Props) => {
  // const {} = useApplicationProperties();
  const fieldRef = useRef<HTMLInputElement>(null);
  const [titleState, setTitleState] = useState<Field>({
    value: title,
    error: null
  });

  const save = useCallback(() => {
    if (titleState.error) {
      return;
    }
    onSave(titleState.value);
  }, [onSave, titleState.error, titleState.value]);

  // Enter Key Save 리스너
  useEffect(() => {
    const fieldEl = fieldRef.current;
    if (fieldEl === null) return;

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        save();
        fieldEl.blur();
      }
    }
    fieldEl.addEventListener('keydown', handleEnter);

    return () => {
      fieldEl.removeEventListener('keydown', handleEnter);
    }
  }, [onSave, save, titleState.error, titleState.value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newError = validateNodeTitle(newTitle);
    setTitleState({ value: newTitle, error: newError });
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      ...sx
    }}>
      <TextField
        // ref={fieldRef}
        name={"title"}
        type="text"
        variant="standard"
        value={titleState.value}
        onChange={handleChange}
        error={!!titleState.error}
        helperText={titleState.error}
        required
        sx={{
          my: fieldMarginY,
          ...sx
        }}
        fullWidth
        slotProps={{
          input: {
            inputRef: fieldRef,
            endAdornment: (
              <Button
                variant="text"
                onClick={save}
              >
                저장
              </Button>
            )
          }
        }}
      />
    </Box>
  )
}
import { Button } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { registerEnterShortCut } from "../keyboard";



type OnSaveFn = () => void;

type Args = {
  onSave: OnSaveFn | undefined;
  saveDisabled: boolean;
}

/**
 * 해당 훅의 return 객체를 Mui의 TextField의 slotProps에 넣어주면 됨.
 */
export const useFieldOnSaveMode = ({ onSave, saveDisabled }: Args) => {
  const fieldRef = useRef<HTMLInputElement>(null);

  const save = useCallback(() => {
    if (onSave === undefined) {
      return;
    }
    if (saveDisabled) {
      return;
    }
    onSave();
  }, [onSave, saveDisabled]);

  // Enter Key Save 리스너
  useEffect(() => {
    const fieldEl = fieldRef.current;
    if (!fieldEl) return;

    return registerEnterShortCut({
      element: fieldEl,
      cb: () => {
        save();
        fieldEl.blur();
      }
    });
  }, [onSave, save]);

  const inputSlotProps = {
    inputRef: fieldRef,
    endAdornment: (
      <Button
        variant="text"
        onClick={save}
        disabled={saveDisabled}
      >
        저장
      </Button>
    )
  }

  return {
    inputSlotProps,
  }
}
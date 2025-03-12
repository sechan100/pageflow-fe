import { useCallback, useState } from "react";



export type Field<T = any> = {
  field: string;
  value: T;
  error: string | null;
};

export type FieldState<T> = Field<T> & {
  set: (value: T) => void;
  setError: (error: string | null) => void;
}

export const useFieldState = <T>(fieldName: string, initialValue: T): FieldState<T> => {
  const [field, setField] = useState<Field<T>>({
    field: fieldName,
    value: initialValue,
    error: null,
  });

  const setError = useCallback((error: string | null) => {
    setField((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const setValue = useCallback((value: T) => {
    setField((prev) => ({
      ...prev,
      value,
    }));
  }, []);

  return {
    ...field,
    set: setValue,
    setError,
  };
}

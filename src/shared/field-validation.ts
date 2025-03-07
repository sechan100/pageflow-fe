import { useCallback, useState } from "react";

export type InvalidField = {
  field: string;
  message: string;
  reason?: string;
  value?: string;
}

export type FieldValidationResult = {
  invalidFields: InvalidField[];
}

export const fromInvalidField = (invalidField: InvalidField): FieldValidationResult => ({
  invalidFields: [invalidField]
})


export type UseFieldValidation = {
  setFieldValidation: (result: FieldValidationResult) => void;
  fieldValidation: FieldValidationResult;
  getFieldError(fieldName: string): InvalidField | null;
}
export const useFieldValidation = (): UseFieldValidation => {
  const [fieldValidation, setFieldValidation] = useState<FieldValidationResult>({
    invalidFields: []
  });

  const getFieldError = useCallback((fieldName: string) => {
    return fieldValidation.invalidFields.find(field => field.field === fieldName) ?? null;
  }, [fieldValidation]);

  return {
    setFieldValidation,
    fieldValidation,
    getFieldError
  }
}
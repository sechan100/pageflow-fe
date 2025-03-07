
export type InvalidField = {
  field: string;
  message: string;
  reason?: string;
  value?: string;
}

export type FieldValidationResult = {
  invalidFields: InvalidField[];
}
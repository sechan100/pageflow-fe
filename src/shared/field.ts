

export type InvalidField = {
  field: string;
  reason: string;
  message: string;
  value: string | null;
};

export type ServerFieldValidationResult = {
  invalidFields: InvalidField[];
};


export type FieldError = {
  field: string;
  message: string;
}


export class FieldErrorDispatcher {
  #handlers: Record<string, (message: string) => void> = {};

  constructor(
    private fieldErrors: FieldError[]
  ) { }

  on(field: string, handler: (message: string) => void): FieldErrorDispatcher {
    this.#handlers[field] = handler;
    return this;
  }

  dispatch() {
    this.fieldErrors.forEach((error) => {
      const handler = this.#handlers[error.field];
      if (handler) {
        handler(error.message);
      }
    });
  }

}
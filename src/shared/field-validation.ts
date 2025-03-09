import { useCallback, useState } from "react";



export type Field<T> = {
  field: string;
  value: T;
  error: T | null;
}
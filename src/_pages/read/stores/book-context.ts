import { SimpleBook } from '@/entities/book';
import { createDataContext } from "@/shared/zustand/create-data-context";

export const [BookContextProvider, useBookContext] = createDataContext<SimpleBook>();
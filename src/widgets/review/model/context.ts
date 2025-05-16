import { createDataContext } from "@/shared/zustand/create-data-context";

export const [BookIdContextProvider, useBookIdContext] = createDataContext<string>();
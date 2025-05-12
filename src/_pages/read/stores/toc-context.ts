import { ReadableToc } from "@/entities/book";
import { createDataContext } from "@/shared/zustand/create-data-context";



export const [TocContextProvider, useTocContext] = createDataContext<ReadableToc>();

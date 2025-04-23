import { ReadableToc } from "@/entities/book";
import { createDataContext } from "@/shared/context";



export const [TocContextProvider, useTocContext] = createDataContext<ReadableToc>();

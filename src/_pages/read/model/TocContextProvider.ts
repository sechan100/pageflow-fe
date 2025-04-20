import { createDataContext } from "@/shared/context";
import { ReadableToc } from "../../../entities/book/model/readable-toc";



export const [TocContextProvider, useTocContext] = createDataContext<ReadableToc>();

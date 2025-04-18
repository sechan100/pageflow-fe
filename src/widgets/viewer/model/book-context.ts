import { ReaderPosition } from "@/entities/reader";
import { createDataContext } from "@/shared/context";


export const [ReaderPositionContextProvider, useReaderPosition] = createDataContext<ReaderPosition>();


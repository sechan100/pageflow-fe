import { ReaderTocStore } from '@/entities/reader';
import { createStoreRelayContext } from "@/shared/zustand/create-store-relay-context";


const [ReaderTocStoreContextProvider, useReaderTocStore] = createStoreRelayContext<ReaderTocStore>();

export {
  ReaderTocStoreContextProvider,
  useReaderTocStore
};


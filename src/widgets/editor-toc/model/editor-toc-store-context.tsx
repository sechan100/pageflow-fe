import { EditorTocStore } from "@/entities/editor";
import { createStoreRelayContext } from "@/shared/zustand/create-store-relay-context";


const [EditorTocStoreContextProvider, useEditorTocStore] = createStoreRelayContext<EditorTocStore>();

export {
  EditorTocStoreContextProvider,
  useEditorTocStore
};


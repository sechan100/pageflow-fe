import { createStoreContext } from "@/shared/zustand/create-store-context";
import { memo, useEffect, useState } from "react";
import { defaultFolderOpen } from '../config/default-folder-open';
import { mergeServerToc } from "./merge-toc";
import { SvToc } from "./sv-toc.type";
import { TocOperations } from "./toc-operations";
import { Toc } from "./toc.type";


type TocStore = {
  toc: Toc;
  setToc: (toc: Toc) => void;
  /**
   * 전역적으로 folder들의 open 상태를 관리한다. map 객체 자체를 변경하는 동작은 expendAllFolders, collapseAllFolders이다.
   * 기본적으로 folder들 개별로 open 상태를 관리하며, setFolderOpen을 통해 공용 상태에 업데이트하여 전역적으로 저장한다.
   */
  folderOpenRegistry: Map<string, boolean>;
  setFolderOpen: (folderId: string, isOpen: boolean) => void;
  expendAllFolders: () => void;
  collapseAllFolders: () => void;
}

const [Provider, useStore] = createStoreContext<Toc, TocStore>((initialToc, set, get) => ({
  toc: initialToc,

  setToc: (toc) => set({ toc }),

  folderOpenRegistry: TocOperations.toMapWith(initialToc, (node) => node.type === "folder", () => defaultFolderOpen),

  setFolderOpen: (folderId, isOpen) => {
    get().folderOpenRegistry.set(folderId, isOpen);
  },

  expendAllFolders: () => {
    const newRegistry = new Map();
    get().folderOpenRegistry.keys().forEach(folderId => {
      newRegistry.set(folderId, true);
    });
    set({ folderOpenRegistry: newRegistry });
  },

  collapseAllFolders: () => {
    const newRegistry = new Map();
    get().folderOpenRegistry.keys().forEach(folderId => {
      newRegistry.set(folderId, false);
    });
    set({ folderOpenRegistry: newRegistry });
  }
}));

type Props = {
  svToc: SvToc;
  children: React.ReactNode;
}
export const TocStoreProvider = memo(function TocStoreProvider({
  svToc,
  children
}: Props) {
  const [toc, setToc] = useState<Toc | null>(null);

  // 새로운 svToc가 들어오면, 기존 toc와 병합하여 새로운 toc를 만든다.
  useEffect(() => {
    if (toc === null) {
      setToc(mergeServerToc(svToc, toc));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svToc]);

  if (!toc) {
    return <div>toc merging...</div>
  }

  return (
    <Provider data={toc} onDataChange={(s, newToc) => s.setState({ toc: newToc })}>
      {children}
    </Provider>
  )
})

export const useTocStore = useStore;
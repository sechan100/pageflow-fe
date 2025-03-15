import { useCallback, useEffect, useState } from "react";
import { defaultFolderOpen } from "../config";
import { useToc } from "./use-toc";






export const useFolderOpen = (folderId: string, options: { disabled: boolean } = { disabled: false }) => {
  const [isOpen, setIsOpen] = useState(defaultFolderOpen);
  const folderOpenRegistry = useToc(s => s.folderOpenRegistry);
  const syncFolderOpenState = useToc(s => s.syncFolderOpenState);

  // folderOpenRegistry 자체 상태가 변경되면 동기화함.
  useEffect(() => {
    if (options.disabled) return;
    const registryOpen = folderOpenRegistry.get(folderId);
    if (registryOpen !== undefined) {
      setIsOpen(registryOpen);
    } else {
      throw new Error(`folderId: ${folderId}에 대한 open 상태가 존재하지 않습니다.`);
    }
  }, [folderId, folderOpenRegistry, options.disabled]);

  // registry와 동기화된 toggle 함수
  const toggle = useCallback(() => {
    if (options.disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    syncFolderOpenState(folderId, newIsOpen);
  }, [folderId, isOpen, options.disabled, syncFolderOpenState]);

  return {
    isOpen,
    getIsOpen: () => {
      const isOpen = folderOpenRegistry.get(folderId);
      if (isOpen !== undefined) {
        return isOpen;
      } else {
        throw new Error(`folderId: ${folderId}에 대한 open 상태가 존재하지 않습니다.`);
      }
    },
    toggle
  };
}
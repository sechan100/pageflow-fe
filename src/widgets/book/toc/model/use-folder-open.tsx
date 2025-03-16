import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultFolderOpen } from "../config";
import { useToc } from "./use-toc";






export const useFolderOpen = (folderId: string, disabled = false) => {
  const folderOpenRegistry = useToc(s => s.folderOpenRegistry);
  const syncFolderOpenState = useToc(s => s.syncFolderOpenState);
  const syncedIsOpen = useMemo<boolean>(() => {
    const synced = folderOpenRegistry.get(folderId);
    if (synced !== undefined) {
      return synced;
    } else {
      return defaultFolderOpen;
    }
  }, [folderId, folderOpenRegistry]);

  const [isOpen, setIsOpen] = useState(syncedIsOpen);

  // folderOpenRegistry 자체 상태가 변경되면 동기화함.
  useEffect(() => {
    if (disabled) return;
    const registryOpen = folderOpenRegistry.get(folderId);
    if (registryOpen !== undefined) {
      setIsOpen(registryOpen);
    } else {
      throw new Error(`folderId: ${folderId}에 대한 open 상태가 존재하지 않습니다.`);
    }
  }, [folderId, folderOpenRegistry, disabled, isOpen]);

  // registry와 동기화된 toggle 함수
  const toggle = useCallback(() => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    syncFolderOpenState(folderId, newIsOpen);
  }, [folderId, isOpen, disabled, syncFolderOpenState]);

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
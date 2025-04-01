import { useWritePageDialMenuStore } from '@/features/book';
import { useNotification } from "@/shared/notification";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SpeedDialIcon } from '@mui/material';
import { debounce } from "lodash";
import { SaveIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo } from "react";
import { $getHtmlSerializedEditorState } from "./$getHtmlSerializedEditorState";
import { editorStateSyncUpdateTag } from './use-lexical-editor-serialized-html-sync';
import { useSectionContent } from "./use-section-content";


const AUTO_SAVE_INTERVAL = 4000;

/**
 * lexical context 안에서 section 내용을 저장하는 기능을 추가한다.
 * WritePageDial과 단축키, 그리고 자동 저장 기능등
 */
export const useLexicalEditorSave = (sectionId: string) => {
  const [editor] = useLexicalComposerContext();
  const setMainDial = useWritePageDialMenuStore(s => s.setMainDial);
  const { save, sync } = useSectionContent(sectionId);
  const notification = useNotification();

  const saveToServer = useCallback(async () => {
    // editor의 내용을 서버와 동기화
    const res = await sync();
    if (res.result === 'success') {
      notification.show('저장되었습니다.', {
        severity: 'success',
        autoHideDuration: 1000,
      });
    } else if (res.result === 'lastest') {
      return;
    } else {
      notification.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [notification, sync]);

  const saveToServerDebounce = useMemo(() => debounce(saveToServer, AUTO_SAVE_INTERVAL), [saveToServer]);

  // editor의 현재 내용을 로컬스토리지에 저장
  const saveEditorState = useCallback(() => {
    editor.read(async () => {
      const html = $getHtmlSerializedEditorState();
      save(html);
      saveToServerDebounce();
    })
  }, [editor, save, saveToServerDebounce]);

  const manualSave = useCallback(() => {
    saveToServerDebounce.cancel();
    saveToServer();
  }, [saveToServer, saveToServerDebounce]);

  // save 단축키 등록
  useEffect(() => {
    const saveShortcutHandler = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        manualSave();
      }
    }
    const editorRootEl = editor._rootElement;
    if (!editorRootEl) return;
    editorRootEl.addEventListener("keydown", saveShortcutHandler)
    return () => {
      editorRootEl.removeEventListener("keydown", saveShortcutHandler)
    }
  }, [editor, manualSave]);


  // 자동저장 설정
  useEffect(() => {
    return editor.registerUpdateListener(({ tags, dirtyElements, editorState, prevEditorState, dirtyLeaves }) => {
      if (tags.has("history-merge") || tags.has(editorStateSyncUpdateTag)) return;
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      saveEditorState();
    })
  }, [editor, saveEditorState]);

  // Main Dial에 저장 버튼 등록
  useEffect(() => {
    const cleanup = setMainDial({
      name: '저장',
      icon: <SpeedDialIcon openIcon={<SaveIcon />} />,
      cb: manualSave,
    });

    return cleanup;
  }, [setMainDial, manualSave]);
}
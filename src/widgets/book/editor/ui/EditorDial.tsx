'use client'
import { useNotification } from "@/shared/notification";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FileCopy } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, SxProps } from "@mui/material";
import { debounce } from "lodash";
import { PrinterIcon, SaveIcon, ShareIcon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { $getHtmlSerializedEditorState } from "../model/$getHtmlSerializedEditorState";
import { useSectionContent } from "../model/use-section-content";



const AUTO_SAVE_INTERVAL = 4000;


type Props = {
  sectionId: string,
  sx?: SxProps
}
export const EditorDial = ({
  sectionId,
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();
  const { save, sync } = useSectionContent(sectionId);
  const notification = useNotification();
  const actions = useMemo(() => [
    { icon: <FileCopy />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrinterIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ], []);

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
    return editor.registerUpdateListener(({ tags, dirtyElements, dirtyLeaves }) => {
      if (tags.has("history-merge")) return;

      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

      saveEditorState();
    })
  }, [editor, saveEditorState]);

  return (
    <>
      <SpeedDial
        ariaLabel="editor dial"
        sx={{ position: 'fixed', bottom: 50, right: 50 }}
        icon={<SpeedDialIcon openIcon={<SaveIcon />} />}
        onClick={manualSave}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name
              }
            }}
          />
        ))}
      </SpeedDial>
    </>
  )
}
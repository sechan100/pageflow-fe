'use client'
import { useNotification } from "@/shared/notification";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FileCopy } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, SxProps } from "@mui/material";
import { debounce } from "lodash";
import { PrinterIcon, SaveIcon, ShareIcon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { $getHtmlSerializedEditorState } from "../model/save-editor-state";
import { useSectionContentRepository } from "../model/use-section-content-repository";



const AUTO_SAVE_INTERVAL = 1000;


type Props = {
  sectionId: string,
  sx?: SxProps
}
export const EditorDial = ({
  sectionId,
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();
  const { load, save, flush } = useSectionContentRepository(sectionId);
  const notification = useNotification();
  const actions = useMemo(() => [
    { icon: <FileCopy />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrinterIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ], []);

  // editor의 현재 내용을 로컬스토리지에 저장
  const saveEditorState = useCallback(() => {
    editor.read(async () => {
      const html = $getHtmlSerializedEditorState();
      save(html);
    })
  }, [editor, save]);

  // editor의 내용을 서버와 동기화
  const flushEditorState = useCallback(async () => {
    saveEditorState();
    const res = await flush();
    if (res.result === 'success') {
      notification.success('저장되었습니다.');
    } else if (res.result === 'lastest') {
      return;
    } else {
      notification.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [flush, notification, saveEditorState]);

  // flush 단축키 등록
  useEffect(() => {
    const saveShortcutHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        flushEditorState();
      }
    }
    const editorRootEl = editor._rootElement;
    if (!editorRootEl) return;
    editorRootEl.addEventListener("keydown", saveShortcutHandler)
    return () => {
      editorRootEl.removeEventListener("keydown", saveShortcutHandler)
    }
  }, [editor, flushEditorState]);


  // 자동저장 설정
  useEffect(() => {
    const debouncedSave = debounce(saveEditorState, AUTO_SAVE_INTERVAL);
    return editor.registerUpdateListener(() => {
      debouncedSave();
    })
  }, [editor, saveEditorState]);

  return (
    <>
      <SpeedDial
        ariaLabel="editor dial"
        sx={{ position: 'fixed', bottom: 50, right: 50 }}
        icon={<SpeedDialIcon openIcon={<SaveIcon />} />}
        onClick={flushEditorState}
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
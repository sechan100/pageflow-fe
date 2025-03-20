'use client'
import { useNotification } from "@/shared/notification";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FileCopy } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, SxProps } from "@mui/material";
import { PrinterIcon, SaveIcon, ShareIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { sectionContentSaveApi } from "../api/save-section-content";
import { $getHtmlSerializedEditorState } from "../model/save-editor-state";




type Props = {
  sectionId: string,
  sx?: SxProps
}
export const EditorDial = ({
  sectionId,
  sx
}: Props) => {
  const [editor] = useLexicalComposerContext();
  const notification = useNotification();
  const actions = useMemo(() => [
    { icon: <FileCopy />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrinterIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ], []);

  // editor의 현재 내용을 저장
  const handleSave = useCallback(() => {
    editor.read(async () => {
      const html = $getHtmlSerializedEditorState();
      await sectionContentSaveApi(sectionId, html);
      notification.success('내용이 저장되었습니다.');
    })
  }, [editor, notification, sectionId]);

  return (
    <>
      <SpeedDial
        ariaLabel="editor dial"
        sx={{ position: 'fixed', bottom: 50, right: 50 }}
        icon={<SpeedDialIcon openIcon={<SaveIcon />} />}
        onClick={handleSave}
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
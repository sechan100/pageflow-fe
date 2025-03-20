'use client';

import { STYLES } from '@/global/styles';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { Box, Divider, IconButton, Paper, Popper, SxProps } from '@mui/material';
import {
  $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND
} from 'lexical';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered, Strikethrough,
  Underline
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { $formatHeading, $isH } from '../model/format-heading';
import { $formatList } from '../model/format-list';


const LowPriority = 1;
const iconSize = 20;




type ToolBoxProps = {
  children?: React.ReactNode
  sx?: SxProps
}
const ToolBox = ({
  children,
  sx
}: ToolBoxProps) => {

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      {children}
    </Box>
  )
}

type ToolbarState = {
  isBold: boolean,
  isItalic: boolean,
  isUnderline: boolean,
  isStrikethrough: boolean,
  isHeading1: boolean,
  isHeading2: boolean,
  isHeading3: boolean,
}

type Props = {
  sx?: SxProps;
}
export const PopperToolbar = ({
  sx,
}: Props) => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [{
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isHeading1,
    isHeading2,
    isHeading3,
  }, setToolbarState] = useState<ToolbarState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
  });

  // selection을 기반으로 anchorRef DOM을 할당해준다.
  const $updateAnchorWithSelection = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const firstNode = selection.getNodes()[0].getParent();
      if (firstNode === null) return;
      const firstNodeEl = editor.getElementByKey(firstNode.getKey());
      if (firstNodeEl === null) return;
      setAnchorEl(firstNodeEl);
    }
  }, [editor]);

  // selection이 있을 때만 toolbar를 열어준다.
  const $updateIsOpen = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const isRange = selection.anchor.offset !== selection.focus.offset;
      setIsOpen(isRange);
    } else {
      setIsOpen(false);
    }
  }, []);

  // editor focus가 out되면 toolbar를 닫아준다.
  useEffect(() => {
    const closeToolbar = (e: FocusEvent) => {
      // focus가 toolbar로 이동할 때는 닫지 않는다.
      const el = e.relatedTarget;
      if (el instanceof HTMLElement && el.closest('.pf-editor-toolbar') !== null) {
        return;
      }
      setIsOpen(false);
    }
    const rootEl = editor.getRootElement();
    if (rootEl === null) return;
    rootEl.addEventListener('focusout', closeToolbar);
    return () => {
      rootEl.removeEventListener('focusout', closeToolbar);
    }
  }, [editor]);

  // toolbar의 상태들을 업데이트한다.
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      const newToolbarState = {
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        isStrikethrough: selection.hasFormat('strikethrough'),
        isHeading1: $isH(selection, 'h1'),
        isHeading2: $isH(selection, 'h2'),
        isHeading3: $isH(selection, 'h3'),
      }
      setToolbarState(newToolbarState);
    }
  }, []);

  // hn으로 변환하거나, 이미 hn인 경우 paragraph로 변환
  const formatHeading = useCallback((headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => $formatHeading(headingSize));
  }, [editor]);

  // listType이 ol인 경우 ol로 변환, ul인 경우 ul로 변환, 이미 list인 경우 list를 제거
  const formatList = useCallback((listType: 'ol' | 'ul') => {
    editor.update(() => $formatList(listType));
  }, [editor]);

  // updateToolbar, canUndo, canRedo등을 Toolbar와 동기화
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      // selection이 변경될 때마다 toolbar 업데이트
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          $updateAnchorWithSelection();
          $updateIsOpen();
          return false;
        },
        LowPriority,
      )
    );
  }, [editor, $updateToolbar, $updateAnchorWithSelection, $updateIsOpen]);

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement="top"
      className='pf-editor-toolbar'
    >
      <Paper
        sx={{
          display: 'flex',
          gap: 1,
          background: STYLES.color.background,
        }}
      >
        {/* text format */}
        <ToolBox>
          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            color={isBold ? 'primary' : 'default'}
          >
            <Bold size={iconSize} />
          </IconButton>
          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            color={isItalic ? 'primary' : 'default'}
          >
            <Italic size={iconSize} />
          </IconButton>
          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            color={isUnderline ? 'primary' : 'default'}
          >
            <Underline size={iconSize} />
          </IconButton>
          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
            color={isStrikethrough ? 'primary' : 'default'}
          >
            <Strikethrough size={iconSize} />
          </IconButton>
        </ToolBox>
        {/* heading */}
        <ToolBox>
          <IconButton
            onClick={() => formatHeading('h1')}
            color={isHeading1 ? 'primary' : 'default'}
          >
            <Heading1 size={iconSize} />
          </IconButton>
          <IconButton
            onClick={() => formatHeading('h2')}
            color={isHeading2 ? 'primary' : 'default'}
          >
            <Heading2 size={iconSize} />
          </IconButton>
          <IconButton
            onClick={() => formatHeading('h3')}
            color={isHeading3 ? 'primary' : 'default'}
          >
            <Heading3 size={iconSize} />
          </IconButton>
        </ToolBox>
        {/* list */}
        <ToolBox>
          <IconButton
            onClick={() => formatList('ol')}
          >
            <ListOrdered size={iconSize} />
          </IconButton>
          <IconButton
            onClick={() => formatList('ul')}
          >
            <List size={iconSize} />
          </IconButton>
        </ToolBox>
      </Paper>
      <Divider />
    </Popper>
  );
}

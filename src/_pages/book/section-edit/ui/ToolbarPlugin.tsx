'use client';

import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { Box, Divider, IconButton, SxProps } from '@mui/material';
import {
  $createParagraphNode, $getSelection, $isRangeSelection, BaseSelection, CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND, FORMAT_TEXT_COMMAND, REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline,
  Undo
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';


const LowPriority = 1;

// heading인지, 그리고 구체적으로 어떤 heading인지 확인해주는 함수
const $isH = (selection: BaseSelection, headingSize: 'h1' | 'h2' | 'h3'): boolean => {
  const parent = selection.getNodes()[0].getParent();
  if (parent !== null) {
    return $isHeadingNode(parent) && parent.getTag() === headingSize;
  } else {
    return false;
  }
}

type Props = {
  sx?: SxProps;
}
export const ToolbarPlugin = ({
  sx,
}: Props) => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHeading1, setIsHeading1] = useState(false);
  const [isHeading2, setIsHeading2] = useState(false);
  const [isHeading3, setIsHeading3] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsHeading1($isH(selection, 'h1'));
      setIsHeading2($isH(selection, 'h2'));
      setIsHeading3($isH(selection, 'h3'));
    }
  }, []);

  const formatHeading = useCallback((headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {

        if ($isH(selection, headingSize)) {
          // 이미 heading인 경우 paragraph로 변환
          $setBlocksType(selection, () => {
            const nodes = selection.getNodes();
            const paragraphNode = $createParagraphNode();
            paragraphNode.append(...nodes);
            return paragraphNode;
          });
        } else {
          // 헤딩이 아닌 경우 헤딩으로 변환
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      }
    });
  }, [editor]);

  // updateToolbar, canUndo, canRedo등을 다양한 editor command 발생과 동기화
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  return (
    <Box
      ref={toolbarRef}
    >
      <IconButton
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo />
      </IconButton>
      <IconButton
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <Redo />
      </IconButton>
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        color={isBold ? 'primary' : 'default'}
      >
        <Bold />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        color={isItalic ? 'primary' : 'default'}
      >
        <Italic />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        color={isUnderline ? 'primary' : 'default'}
      >
        <Underline />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        color={isStrikethrough ? 'primary' : 'default'}
      >
        <Strikethrough />
      </IconButton>
      <Divider />
      <IconButton
        onClick={() => formatHeading('h1')}
        color={isHeading1 ? 'primary' : 'default'}
      >
        <Heading1 />
      </IconButton>
      <IconButton
        onClick={() => formatHeading('h2')}
        color={isHeading2 ? 'primary' : 'default'}
      >
        <Heading2 />
      </IconButton>
      <IconButton
        onClick={() => formatHeading('h3')}
        color={isHeading3 ? 'primary' : 'default'}
      >
        <Heading3 />
      </IconButton>
      <Divider />
      <IconButton
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
      >
        <ListOrdered />
      </IconButton>
      <IconButton
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      >
        <List />
      </IconButton>
      <Divider />
    </Box>
  );
}

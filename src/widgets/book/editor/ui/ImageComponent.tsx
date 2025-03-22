/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import type {
  BaseSelection, NodeKey
} from 'lexical'
import type { Position } from './ImageNode'
import './image-node.css'

import { STYLES } from '@/global/styles'
import { OverflowNode } from '@lexical/overflow'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { Box, Button, IconButton, SxProps } from '@mui/material'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection, CLICK_COMMAND,
  COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND
} from 'lexical'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { $isImageNode } from './ImageNode'


type PositionMoveButtonProps = {
  direction: "left" | "right";
  position: Position;
  hover: boolean;
  onClick: (role: "left" | "right") => void;
  sx?: SxProps
}
const PositionMoveButton = ({
  direction,
  position,
  hover,
  onClick,
  sx
}: PositionMoveButtonProps) => {

  // left일 때 left 버튼은 보이지 않아야함.
  if (position === direction) {
    return <></>
  }

  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: "50%",
        transform: "translateY(-50%)",
        left: direction === "left" ? 0 : undefined,
        right: direction === "right" ? 0 : undefined,
        visibility: hover ? 'visible' : 'hidden',
        zIndex: 20,
        color: 'white',
      }}
      onClick={() => onClick(direction)}
    >
      {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  )
}

export const captionEditorTheme = {
  ltr: 'ltr',
  paragraph: 'pf-caption-p',
};

type CaptionLexicalEditor = {
  sx?: SxProps
}
const CaptionLexicalEditor = ({
  sx
}: CaptionLexicalEditor) => {

  return (
    <Box sx={{
      "& .pf-caption-p": {
        m: 0,
        textAlign: 'center',
        fontSize: '12px',
        color: STYLES.color.description
      },
    }}>
      <LexicalComposer
        initialConfig={{
          namespace: 'Section Editor',
          nodes: [OverflowNode],
          onError(error: Error) {
            throw error;
          },
          theme: captionEditorTheme,
        }}
      >
        <PlainTextPlugin
          contentEditable={<ContentEditable style={{ width: "100%" }} />}
          placeholder={<Box sx={{ borderTop: STYLES.border.solid }}>설명을 입력해주세요.</Box>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CharacterLimitPlugin
          charset='UTF-16'
          maxLength={100}
          renderer={({ remainingCharacters, }: {
            remainingCharacters: number;
          }) => (
            <Box sx={{
              borderTop: '1px solid hsla(0, 0%, 0%, 0.1)',
              fontSize: '12px',
            }}>
              {remainingCharacters}자 남음
            </Box>
          )}
        />
        <HistoryPlugin />
      </LexicalComposer>
    </Box>
  )
}

type Props = {
  src: string;
  position: Position;
  width: number;
  height: number;
  caption: string;
  nodeKey: NodeKey;
}
export const LexicalImageDecorator = ({
  src,
  position,
  width,
  height,
  caption,
  nodeKey,
}: Props) => {
  const [hover, setHover] = useState(false);
  const ref = useRef<null | HTMLElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  // DEV: 아래 주석으로 변경
  const [enableCaption, setEnableCaption] = useState(true);
  // const [enableCaption, setEnableCaption] = useState(caption !== '');
  const [captionText, setCaptionText] = useState(caption);

  // 사진 지우기
  const onDelete = useCallback((payload: KeyboardEvent) => {
    if (isSelected && $isNodeSelection($getSelection())) {
      const event: KeyboardEvent = payload
      event.preventDefault();
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node?.remove();
      }
      setSelected(false)
    }
    return false
  }, [isSelected, nodeKey, setSelected])

  // Image의 Position 변경
  const changePosition = useCallback((to: "left" | "right") => {
    // 현재 position을 기준으로 왼쪽으로 가냐 오른쪽으로 가냐를 기준으로 최종 position을 결정
    let newPosition: Position;
    if (position === "full") {
      // 현재 full position이라면 왼쪽이면 left position으로, 오른쪽이면 right position으로 그대로 가면 된다.
      newPosition = to;
    } else {
      // 현재 left position에서 right로 이동하면 full position
      if (position === "left" && to === "right") {
        newPosition = "full";
      }
      // 현재 right position에서 left로 이동하면 full position
      else if (position === "right" && to === "left") {
        newPosition = "full";
      }
      // left position에서 left, right position에서 right로 이동하면 현재 상태를 유지한다.
      else {
        // 이동 안함.
        newPosition = position;
      }
    }

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.update({ position: newPosition })
      }
    })
  }, [editor, nodeKey, position])

  // Editor Registration
  useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      // 에디터가 업데이트되면 현재 selection을 상태로 받아옴.
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),

      // 사진을 클릭하면 Selection을 사진위치로 설정하는 커멘드를 등록
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;
          if (event.target === ref.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      // editor.registerCommand(
      //   DRAGSTART_COMMAND,
      //   (event) => {
      //     if (event.target === ref.current) {
      //       // TODO This is just a temporary workaround for FF to behave like other browsers.
      //       // Ideally, this handles drag & drop too (and all browsers).
      //       event.preventDefault()
      //       return true
      //     }
      //     return false
      //   },
      //   COMMAND_PRIORITY_LOW,
      // ),

      // 사진 삭제를 위한 커멘드 등록
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    )
    return () => {
      isMounted = false
      unregister()
    }
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected])

  const draggable = isSelected && $isNodeSelection(selection);
  return (
    <Box sx={{
      display: 'inline-flex',
      flexDirection: 'column',
    }}>
      <Box>
        <Box
          ref={ref}
          draggable={draggable}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
            border: isSelected ? `3px dashed ${STYLES.color.primary}` : 'none',
            borderRadius: '4px',
            "&::after": (hover ? {
              content: '""',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 10,
            } : {})
          }}
        >
          <PositionMoveButton
            direction='left'
            hover={hover}
            position={position}
            onClick={changePosition}
          />
          <NextImage
            src={src}
            className={isSelected ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : undefined}
            alt={caption}
            data-position={position}
            width={width}
            height={height}
            style={{
              display: 'block',
            }}
            draggable="false"
          />
          <PositionMoveButton
            direction='right'
            hover={hover}
            position={position}
            onClick={changePosition}
          />
          {/* Caption Enable Button */}
          <Button
            onClick={() => setEnableCaption(!enableCaption)}
            sx={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              visibility: hover ? 'visible' : 'hidden',
              color: 'white',
              borderTop: '1px solid white',
              width: "100%",
              fontSize: '12px',
            }}
          >
            {enableCaption ? "사진 설명 삭제" : "사진 설명 추가"}
          </Button>
        </Box>
      </Box>
      {enableCaption && (
        <CaptionLexicalEditor />
      )}
    </Box>
  )
}

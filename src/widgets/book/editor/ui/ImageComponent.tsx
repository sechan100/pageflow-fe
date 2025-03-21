/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  BaseSelection, NodeKey
} from 'lexical'
import type { Position } from './ImageNode'
import './image-node.css'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'

import { STYLES } from '@/global/styles'
import { Box, IconButton, SxProps } from '@mui/material'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection, CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND
} from 'lexical'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { $isImageNode } from './ImageNode'


// export function UpdateImageDialog({
//   activeEditor,
//   nodeKey,
//   onClose,
//   open,
// }: {
//   activeEditor: LexicalEditor;
//   nodeKey: NodeKey;
//   open: boolean;
//   onClose: () => void;
// }) {
//   const editorState = activeEditor.getEditorState()
//   const node = editorState.read(() => $getNodeByKey(nodeKey) as ImageNode)
//   const [altText, setAltText] = useState(node.getAltText())
//   const [showCaption, setShowCaption] = useState(node.getShowCaption())
//   const [position, setPosition] = useState<Position>(node.getPosition())

//   const handleShowCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setShowCaption(e.target.checked)
//   }

//   const handlePositionChange = (e: SelectChangeEvent<"left" | "right" | "full">) => {
//     setPosition(e.target.value as Position)
//   }

//   const handleOnConfirm = () => {
//     const payload = { altText, showCaption, position }
//     if (node) {
//       activeEditor.update(() => { node.update(payload) })
//     }
//     onClose()
//   }

//   return (
//     <Modal open={open} onClose={onClose}>
//       <>
//         <div style={{ marginBottom: '1em' }}>
//           <TextField
//             label="Alt Text"
//             placeholder="Descriptive alternative text"
//             onChange={(e) => setAltText(e.target.value)}
//             value={altText}
//           />
//         </div>

//         <Select
//           style={{ marginBottom: '1em', width: '208px' }}
//           value={position}
//           label="Position"
//           name="position"
//           onChange={handlePositionChange}>
//           <MenuItem value="left">Left</MenuItem>
//           <MenuItem value="right">Right</MenuItem>
//           <MenuItem value="full">Full Width</MenuItem>
//         </Select>

//         <div className="Input__wrapper">
//           <input id="caption" type="checkbox" checked={showCaption} onChange={handleShowCaptionChange} />
//           <label htmlFor="caption">Show Caption</label>
//         </div>

//         <Button
//           onClick={() => handleOnConfirm()}>
//           Confirm
//         </Button>
//       </>
//     </Modal>
//   )
// }


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
  const [captionText, setCaptionText] = useState('');
  const [selection, setSelection] = useState<BaseSelection | null>(null);

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

  // const onEnter = useCallback(
  //   (event: KeyboardEvent) => {
  //     const latestSelection = $getSelection()
  //     const buttonElem = buttonRef.current
  //     if (
  //       isSelected &&
  //       $isNodeSelection(latestSelection) &&
  //       latestSelection.getNodes().length === 1
  //     ) {
  //       if (showCaption) {
  //         // Move focus into nested editor
  //         $setSelection(null)
  //         event.preventDefault()
  //         caption.focus()
  //         return true
  //       } else if (
  //         buttonElem !== null &&
  //         buttonElem !== document.activeElement
  //       ) {
  //         event.preventDefault()
  //         buttonElem.focus()
  //         return true
  //       }
  //     }
  //     return false
  //   },
  //   [caption, isSelected, showCaption],
  // )

  // const onEscape = useCallback(
  //   (event: KeyboardEvent) => {
  //     if (
  //       activeEditorRef.current === caption ||
  //       buttonRef.current === event.target
  //     ) {
  //       $setSelection(null)
  //       editor.update(() => {
  //         setSelected(true)
  //         const parentRootElement = editor.getRootElement()
  //         if (parentRootElement !== null) {
  //           parentRootElement.focus()
  //         }
  //       })
  //       return true
  //     }
  //     return false
  //   },
  //   [caption, editor, setSelected],
  // )

  // Editor Registration

  useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()))
        }
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload
          if (event.target === ref.current) {
            if (event.shiftKey) {
              setSelected(!isSelected)
            } else {
              clearSelection()
              setSelected(true)
            }
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === ref.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      // 사진 지우기 이벤트 등록
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      // editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      // editor.registerCommand(
      //   KEY_ESCAPE_COMMAND,
      //   onEscape,
      //   COMMAND_PRIORITY_LOW,
      // ),
    )
    return () => {
      isMounted = false
      unregister()
    }
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected])

  const draggable = isSelected && $isNodeSelection(selection);
  return (
    <>
      {/* <UpdateImageDialog
          activeEditor={editor}
          nodeKey={nodeKey}
          open={open}
          onClose={() => setOpen(false)}
        /> */}
      <Box
        ref={ref}
        draggable={draggable}
        // onClick={() => selectThisNode()}
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
            height,
            width,
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
      </Box>
      {/* {showCaption && (
          <TextField
            label="Caption"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
          />
        )} */}
    </>
  )
}

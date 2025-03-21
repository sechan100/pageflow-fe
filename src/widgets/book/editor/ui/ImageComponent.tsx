/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  BaseSelection,
  LexicalEditor,
  NodeKey
} from 'lexical'
import type { Position } from './ImageNode'
import './image-node.css'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'

import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection, CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND, SELECTION_CHANGE_COMMAND
} from 'lexical'
import NextImage from 'next/image'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
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
  const [open, setOpen] = useState(false);
  const imageRef = useRef<null | HTMLImageElement>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [editor] = useLexicalComposerContext()
  const [captionText, setCaptionText] = useState('')
  const [selection, setSelection] = useState<BaseSelection | null>(null)
  const activeEditorRef = useRef<LexicalEditor | null>(null)

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node?.remove()
        }
        setSelected(false)
      }
      return false
    },
    [isSelected, nodeKey, setSelected],
  )

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

  useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()))
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload
          if (event.target === imageRef.current) {
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
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
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

  const draggable = isSelected && $isNodeSelection(selection)
  const isFocused = isSelected
  return (
    <Suspense fallback={null}>
      <>
        {/* <UpdateImageDialog
          activeEditor={editor}
          nodeKey={nodeKey}
          open={open}
          onClose={() => setOpen(false)}
        /> */}
        <div draggable={draggable}>
          {/* <button
            className="image-edit-button"
            ref={buttonRef}
            onClick={() => setOpen(true)}>
            Edit
          </button> */}
          <NextImage
            className={
              isFocused
                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                : undefined
            }
            src={src}
            alt={caption}
            ref={imageRef}
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
        </div>
        {/* {showCaption && (
          <TextField
            label="Caption"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
          />
        )} */}
      </>
    </Suspense>
  )
}

import { OverflowNode } from '@lexical/overflow'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import type {
  BaseSelection, NodeKey
} from 'lexical'
import { Resizable } from 're-resizable'
import type { Position } from './ImageNode'
import './image-node.css'

import { STYLES } from '@/global/styles'
import { LexicalPlaceholder } from '@/shared/components/LexicalPlaceholder'
import { $generateNodesFromDOM } from '@lexical/html'
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer'
import { Box, Button, IconButton, SxProps } from '@mui/material'
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isNodeSelection, $isParagraphNode, CLICK_COMMAND,
  COMMAND_PRIORITY_LOW, createEditor, KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalEditor,
  LineBreakNode,
  RootNode,
  SELECTION_CHANGE_COMMAND
} from 'lexical'
import { debounce } from 'lodash'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  caption: string;
  onChange?: (caption: string) => void;
  sx?: SxProps;
}
const CaptionLexicalEditor = ({
  caption,
  onChange,
  sx
}: CaptionLexicalEditor) => {
  const editorRef = useRef<LexicalEditor>(createEditor());

  const $onChangeDebounce = useMemo(() => debounce((html: string) => {
    onChange?.(html);
  }, 1000), [onChange]);

  // editor registration
  useEffect(() => mergeRegister(
    // 줄바꿈 금지
    editorRef.current.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      if (rootNode.getChildrenSize() <= 1) return;
      rootNode.getLastChild()?.remove();
    }),
    // 줄바꿈 금지
    editorRef.current.registerNodeTransform(LineBreakNode, (node) => {
      node.remove();
    }),
    // overflow된 경우 글자 제거
    editorRef.current.registerNodeTransform(OverflowNode, (overflowNode) => {
      overflowNode.remove();
    }),
    editorRef.current.registerUpdateListener(({ editorState }) => editorState.read(() => {
      const singleParagraph = $getRoot().getChildren()[0];
      if ($isParagraphNode(singleParagraph)) {
        const text = singleParagraph.getTextContent();
        $onChangeDebounce(text);
      }
    })),
    // 상위 SELECTION_CHANGE_COMMAND에 영향을 받지 않도록(PopperToolbar와 충돌함.)
    editorRef.current.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, _newEditor) => {
        return true;
      },
      COMMAND_PRIORITY_LOW,
    )
  ), [$onChangeDebounce]);

  // props로 받아온 caption을 editor에 반영
  useEffect(() => {
    const editor = editorRef.current;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(caption, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().clear();
      $insertNodes(nodes);
    });
  }, [caption]);


  return (
    <Box sx={{
      position: 'relative',
      "& .pf-caption-p": {
        m: 0,
        textAlign: 'center',
        fontSize: '12px',
        color: STYLES.color.description
      },
      ...sx
    }}>
      <LexicalNestedComposer
        initialEditor={editorRef.current}
        initialNodes={[OverflowNode]}
        initialTheme={captionEditorTheme}
      >
        <PlainTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={
            <LexicalPlaceholder
              sx={{
                color: STYLES.color.description,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: '12px',
              }}
              text="설명을 입력해주세요."
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CharacterLimitPlugin
          charset='UTF-16'
          maxLength={500}
          renderer={({ remainingCharacters, }: {
            remainingCharacters: number;
          }) => {
            if (remainingCharacters <= 0) {
              return (
                <Box sx={{
                  borderTop: '1px solid hsla(0, 0%, 0%, 0.1)',
                  fontSize: '12px',
                  color: 'red',
                }}>
                  글자수 제한을 초과했습니다.
                </Box>
              )
            } else {
              return <></>;
            }
          }}
        />
        <HistoryPlugin />
      </LexicalNestedComposer>
    </Box >
  )
}

type Props = {
  src: string;
  position: Position;
  width: number;
  height: number;
  caption: string;
  showCaption: boolean;
  nodeKey: NodeKey;
}
export const LexicalImageDecorator = ({
  src,
  position,
  width,
  height,
  caption,
  showCaption,
  nodeKey,
}: Props) => {
  const [hover, setHover] = useState(false);
  const ref = useRef<null | HTMLElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const [size, setSize] = useState({ width, height });

  // position에 따른 caption width 값을 결정
  const captionWidth = useMemo(() => {
    if (position === "full") {
      // 전체 에디터 width 기준
      return "75%";
    } else {
      if (size.width < 200) {
        return size.width * 2;
      } else {
        return size.width * 1.2;
      }
    }
  }, [position, size.width])

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

  // Caption 변경
  const changeCaption = useCallback((caption: string) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.update({ caption })
      }
    })
  }, [editor, nodeKey])

  // showCaption 변경
  const changeShowCaption = useCallback((showCaption: boolean) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.update({ showCaption })
      }
    })
  }, [editor, nodeKey])

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
      gap: 1,
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
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
          <Resizable
            defaultSize={{ width, height }}
            minWidth={100}
            minHeight={100}
            lockAspectRatio
            onResize={(e, direction, ref, d) => {
              setSize({
                width: width + d.width,
                height: height + d.height,
              })
            }}
            onResizeStop={(e, direction, ref, d) => {
              editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if ($isImageNode(node)) {
                  node.setSize(size)
                }
              })
            }}
          >
            <NextImage
              src={src}
              className={isSelected ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : undefined}
              alt={caption}
              data-position={position}
              width={size.width}
              height={size.height}
              style={{
                display: 'block',
              }}
              draggable="false"
            />
          </Resizable>
          <PositionMoveButton
            direction='right'
            hover={hover}
            position={position}
            onClick={changePosition}
          />
          {/* Caption Enable Button */}
          <Button
            onClick={() => changeShowCaption(!showCaption)}
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
            {showCaption ? "사진 설명 삭제" : "사진 설명 추가"}
          </Button>
        </Box>
      </Box>
      {showCaption && (
        <Box sx={{
          width: "100%",
          display: 'flex',
          justifyContent: 'center',
        }}>
          <CaptionLexicalEditor
            sx={{
              width: captionWidth,
            }}
            caption={caption}
            onChange={changeCaption}
          />
        </Box>
      )}
    </Box>
  )
}

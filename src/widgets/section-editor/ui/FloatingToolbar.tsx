'use client';

import { useEditorBookStore } from '@/entities/book';
import { STYLES } from '@/global/styles';
import { getImageDimensions } from '@/shared/image-dimensions';
import { INSERT_IMAGE_COMMAND } from '@/shared/lexical/ImagePlugin';
import { useNotification } from '@/shared/ui/notification';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { Box, Divider, IconButton, Paper, SxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  $getSelection, $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND
} from 'lexical';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3, Italic,
  List,
  ListOrdered, Paperclip, Strikethrough,
  Underline
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import { uploadImageApi } from '../api/upload-image';
import { $formatHeading, $isH } from '../model/format-heading';
import { $formatList } from '../model/format-list';

const iconSize = 20;

// 툴바 상태 관리를 위한 스토어
type ToolbarStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
  position: { top: number; left: number };
  setPosition: (position: { top: number; left: number }) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  position: { top: 0, left: 0 },
  setPosition: (position) => set({ position }),
}));

// 선택 영역의 DOM Rect 가져오기
const getDOMRangeRect = (nativeSelection: Selection, rootElement: HTMLElement): DOMRect => {
  const domRange = nativeSelection.getRangeAt(0);
  let rect = domRange.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    // 선택 영역이 없는 경우, 캐럿 위치를 사용
    const clonedRange = domRange.cloneRange();
    const span = document.createElement('span');
    span.textContent = '\ufeff'; // zero-width space
    clonedRange.insertNode(span);
    rect = span.getBoundingClientRect();
    span.remove();
  }

  return rect;
};

// 툴바 박스 컴포넌트
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
        ...sx
      }}
    >
      {children}
    </Box>
  )
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// 툴바 상태 타입
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
  sectionId: string;
  sx?: SxProps;
}

export const FloatingToolbar = ({
  sectionId,
  sx,
}: Props) => {
  const book = useEditorBookStore(s => s.book);
  const [editor] = useLexicalComposerContext();
  const notification = useNotification();
  const { open, setOpen, position, setPosition } = useToolbarStore();
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  // 툴바 상태
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

  // 드래그 처리를 위한 상태
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const movementThreshold = 5; // 최소 이동 픽셀 기준

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback((e: MouseEvent) => {
    setInitialPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (toolbarRef.current && (e.buttons === 1 || e.buttons === 3)) {
      const distanceMoved = Math.sqrt(
        Math.pow(e.clientX - initialPosition.x, 2) +
        Math.pow(e.clientY - initialPosition.y, 2)
      );

      if (distanceMoved > movementThreshold) {
        toolbarRef.current.style.pointerEvents = 'none';
      }
    }
  }, [initialPosition]);

  const handleMouseUp = useCallback(() => {
    if (toolbarRef.current) {
      toolbarRef.current.style.pointerEvents = 'auto';
    }
  }, []);

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    const root = editor.getRootElement();
    if (root === null) return;
    root.addEventListener('mousedown', handleMouseDown);
    root.addEventListener('mousemove', handleMouseMove);
    root.addEventListener('mouseup', handleMouseUp);

    return () => {
      root.removeEventListener('mousedown', handleMouseDown);
      root.removeEventListener('mousemove', handleMouseMove);
      root.removeEventListener('mouseup', handleMouseUp);
    };
  }, [editor, handleMouseDown, handleMouseMove, handleMouseUp]);

  // 툴바 위치 계산하여 업데이트
  const updateToolbarPosition = useCallback(() => {
    const selection = $getSelection();
    const nativeSelection = window.getSelection();
    const rootElement = editor.getRootElement();
    const toolbarElement = toolbarRef.current;

    if (
      selection !== null &&
      $isRangeSelection(selection) &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      toolbarElement !== null
    ) {
      const rootRect = rootElement.getBoundingClientRect();
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      // 툴바 크기 측정 (이미 렌더링된 경우)
      const toolbarHeight = toolbarElement.offsetHeight || 40;
      const toolbarWidth = toolbarElement.offsetWidth || 250;

      // 툴바 위치 계산 (에디터 상단에 위치)
      let top = rangeRect.top - rootRect.top - toolbarHeight - 8;

      // 중앙 정렬
      let left = rangeRect.left - rootRect.left + (rangeRect.width / 2) - (toolbarWidth / 2);

      // 에디터 영역을 벗어나지 않도록 조정
      if (left < 10) left = 10;
      if (left + toolbarWidth > rootRect.width - 10) {
        left = rootRect.width - toolbarWidth - 10;
      }

      // 화면 상단을 벗어나는 경우 아래에 표시
      if (top < 5) {
        top = rangeRect.bottom - rootRect.top + 8;
      }

      setPosition({ top, left });
    }
  }, [editor, setPosition]);

  // 선택 영역 조건 업데이트
  const $updateIsOpen = useCallback(() => {
    const selection = $getSelection();
    const nativeSelection = window.getSelection();
    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      $isRangeSelection(selection) &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      // 텍스트 컨텐츠 검사
      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (rawTextContent === '') {
        setOpen(false);
        return;
      }

      // IME 입력 중인지 검사
      if (editor.isComposing()) {
        setOpen(false);
        return;
      }

      setOpen(true);
      updateToolbarPosition();
    } else {
      setOpen(false);
    }
  }, [editor, setOpen, updateToolbarPosition]);

  // 에디터 포커스 아웃 시 툴바 닫기
  useEffect(() => {
    const closeToolbar = (e: FocusEvent) => {
      // 툴바로 포커스가 이동할 때는 닫지 않음
      const el = e.relatedTarget;
      if (el instanceof HTMLElement && el.closest('.pf-editor-toolbar') !== null) {
        return;
      }
      setOpen(false);
    }

    const rootEl = editor.getRootElement();
    if (rootEl === null) return;

    rootEl.addEventListener('focusout', closeToolbar);
    return () => {
      rootEl.removeEventListener('focusout', closeToolbar);
    }
  }, [editor, setOpen]);

  // 리사이즈 및 스크롤 이벤트 처리
  useEffect(() => {
    const rootElement = editor.getRootElement();
    const scrollerElem = rootElement?.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        if (open) {
          updateToolbarPosition();
        }
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, updateToolbarPosition, open]);

  // 툴바 상태 업데이트
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // 텍스트 포맷 업데이트
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

  // 헤딩 포맷 적용
  const formatHeading = useCallback((headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => $formatHeading(headingSize));
  }, [editor]);

  // 리스트 포맷 적용
  const formatList = useCallback((listType: 'ol' | 'ul') => {
    editor.update(() => $formatList(listType));
  }, [editor]);

  // 이미지 삽입 커맨드
  const handleImageCommand = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const result = await uploadImageApi({
      bookId: book.id,
      sectionId,
      image: file,
    })
    if (result.success) {
      const { width, height } = await getImageDimensions(result.url);
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: result.url,
        width,
        height,
      });
    } else {
      notification.error(result.message);
    }
  }, [book.id, editor, notification, sectionId]);

  // 에디터 업데이트와 선택 변경 감지
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      // 선택 변경 시 툴바 업데이트
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          $updateIsOpen();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      )
    );
  }, [editor, $updateToolbar, $updateIsOpen]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="pf-editor-toolbar"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 100,
      }}
    >
      <Paper
        ref={toolbarRef}
        sx={{
          display: 'flex',
          gap: 1,
          background: STYLES.color.background,
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.15)',
          borderRadius: '4px',
          padding: '4px',
          ...sx
        }}
      >
        {/* Insert Image */}
        <ToolBox>
          <IconButton
            component="label"
            role={undefined}
            tabIndex={-1}
          >
            <Paperclip size={iconSize} />
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageCommand}
              multiple
            />
          </IconButton>
        </ToolBox>
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
    </div>
  );
}
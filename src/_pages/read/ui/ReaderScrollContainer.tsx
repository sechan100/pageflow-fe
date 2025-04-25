'use client'
import { Box, SxProps } from "@mui/material";
import { debounce } from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { usePositionStore } from "../model/position";
import { contentRenderedEvent } from "../model/reader-event";
import { useTocContext } from "../model/toc-context";
import { useLayoutStore } from "../model/use-reader-layout-store";
import { extractNodeInfoFromElement } from "./logic/content-element";
import { usePages } from "./logic/scroll-pages";

export const columnGapRatio = 0.1;
export const columnWidthRatio = (1 - columnGapRatio) / 2;


type GetCurrentPositionArgs = {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}
const useObserveCurrentPosition = ({ scrollContainerRef }: GetCurrentPositionArgs) => {
  /**
   * 페이지에 첫번째로 보이는 html 문단, 또는 부모 엘리먼트 요소.
   * observer로 folder나 section의 content를 구성하는 Element들을 관찰한다.
   * IntersectionObserver를 사용하여, 보이는 엘리먼트들은 visibleContentSetRef에 추가하고, 보이지 않으면 제거한다.
   * 가장 처음 보이는 엘리먼트는 setFVCLEN을 통해서 저장한다.
   * 만약 페이지 시작부분에 문단이 걸쳐있는 경우, 해당 문단은 아직 visible한 것으로(isIntersecting = true) 판단되기 때문에, Set에 남아있게된다.
   * 이 경우 해당 문단 노드가 fvElement이 된다.
   * 
   * '페이지 넘김'으로 인한 observerCallback이 여러번 실행되기 때문에, 완전히 스크롤이 끝난 이후에 첫번째 노드를 꺼내오면 된다. (JS의 Set은 순서 보장)
   */
  const [firstVisibleElement, setFVElement] = useState<HTMLElement | null>(null);
  const visibleContentSetRef = useRef<Set<Element>>(new Set());

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const contentArea = entry.target;
      if (entry.isIntersecting) {
        visibleContentSetRef.current.add(contentArea);
        // break;
      } else {
        visibleContentSetRef.current.delete(contentArea);
      }
    }
    for (const fvlen of visibleContentSetRef.current.values()) {
      if (fvlen instanceof HTMLElement) {
        setFVElement(fvlen);
        break;
      }
    }
  }, []);

  const registerObserver = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: [0]
    });
    // 모든 섹션 관찰 시작
    let i = 0;
    // const contents = document.querySelectorAll('[data-toc-node-id]');
    document.querySelectorAll('.section-content .reader-lexical-node').forEach((el) => {
      i++;
      observer.observe(el);
    })
    console.debug("observer", i);
    return () => observer.disconnect();
  }, [observerCallback, scrollContainerRef]);

  useEffect(() => {
    const debouncedRegisterObserver = debounce(registerObserver, 100);
    contentRenderedEvent.registerListener(debouncedRegisterObserver);
  }, [registerObserver]);

  return firstVisibleElement;
}


type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const ReaderScrollContainer = ({
  children,
  sx
}: Props) => {
  const layout = useLayoutStore();
  const toc = useTocContext();
  const currentPosition = usePositionStore(s => s.position);
  const setPosition = usePositionStore(s => s.setPosition);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { width } = usePages(scrollContainerRef);

  // 페이지의 첫부분에 보이는 LexicalNode나 FolderNode를 관찰하여 position을 업데이트한다.
  const firstVisibleElement = useObserveCurrentPosition({ scrollContainerRef });
  useEffect(() => {
    if (!firstVisibleElement) return;
    const { tocNodeId, tocNodeType } = extractNodeInfoFromElement(firstVisibleElement);
    // position을 업데이트한다.
    if (currentPosition.tocNodeId === tocNodeId) return;
    setPosition(toc, {
      tocNodeId,
      tocNodeType,
      contentElementIndex: 0,
      contextText: null,
    })
  }, [currentPosition.tocNodeId, firstVisibleElement, setPosition, toc]);

  return (
    <Box
      component="main"
      className="reader-scroll-container"
      ref={scrollContainerRef}
      sx={{
        position: 'relative',
        width: layout.width,
        height: layout.height,
        columnCount: 2,
        columnGap: `${width * columnGapRatio}px`,
        columnWidth: `${width * columnWidthRatio}px`,
        columnFill: "auto",
        overflowX: "hidden",

        // 가로축 미세 오차 때문에 글자가 잘리는 경우를 방지
        px: 1,

        fontSize: layout.fontSize,
        lineHeight: layout.lineHeight,

        "& .pf-p": {
          textAlign: "justify",
          // wordBreak: "break-all",
          orphans: "1 !important",
          m: 0,
        },

        /**
         * 마지막에 반쪽짜리 페이지가 남는 경우를 위해서 항상 가짜 halfPage를 만들어준다.
         * 마지막 페이지가 온전하게 끝나는 경우 그냥 여기는 안보여주면 됨.
         * 해당 페이지 존재 여부에 따라서 scrollWidth page 계산 로직을 달리해야한다.
         */
        "& > *:last-child::after": {
          content: "''",
          visibility: "hidden",
          userSelect: "none",
          display: "block",
          breakBefore: "column",
        }
      }}
    >
      {children}
    </Box >
  )
}
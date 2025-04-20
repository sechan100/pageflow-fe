import { columnGapRatio, columnWidthRatio } from "./section-columns";




type Args = {
  width: number;
  scrollWidth: number;
}
export const useCalculatePages = ({ width, scrollWidth }: Args) => {
  // columnGap width를 포함한 한 칼럼 width
  const gapWidth = width * columnGapRatio;
  const halfPageWidth = (width * columnWidthRatio) + gapWidth;
  // 마지막 칼럼을 gap이 없기 때문에 있다고 가정한 width를 halfPageWidth로 나누어 페이지 수를 구함
  const halfPageCount = Math.round((scrollWidth + gapWidth) / halfPageWidth);

  // 마지막 페이지가 반페이지인지 체크
  const isLastPageHalf = halfPageCount % 2 === 1;
  // 페이지 수는 반 페이지씩 세고, 마지막은 반페이지라면 1개 페이지 더 추가
  const pageCount = Math.floor(halfPageCount / 2) + (isLastPageHalf ? 1 : 0);

  return {
    pageCount,
    isLastPageHalf,
  }
}


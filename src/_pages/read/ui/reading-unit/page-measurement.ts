import { ScrollContainerSize } from "./scroll-container-size";
import { columnGapRatio, columnWidthRatio } from "./ScrollContainer";


export type PageMeasurement = {
  gap: number;
  column: number;
  halfPage: number;
  pageBreakPointCommonDifference: number;
  totalPageCount: number;
  isLastFullPage: boolean;
}

export const measurePage = ({ width, scrollWidth }: ScrollContainerSize) => {
  /**
   * 모든 수치들은 width 값이다.
   * 사용되는 값들은 
   * - column: css columns의 columnWidth
   * - gap: css columns의 columnGap
   * - halfPage: 하나의 column과 하나의 gap을 합친 수치
   * -pageBreakPointCommonDifference: 페이지가 바뀌는 지점을 각 항으로 하는 등차수열의 공차(첫 항 = 0)
   */
  const gap = width * columnGapRatio;
  const column = width * columnWidthRatio;
  const halfPage = column + gap;
  const pageBreakPointCommonDifference = halfPage * 2;

  /**
   * 칼럼은 column, gap 순서대로 번갈아가며 등장하다가, 마지막에는 column으로 끝난다. 
   * halfPage는 column과 gap을 합친 수치로, 마지막에 gap으로 끝나는 경우에 'halfPageCount * 2 = pageCount'가 맞아 떨어진다.
   * 때문에 전체 scrollWidth에 gap을 하나 더한 후 halfPage로 나누어 페이지 수를 구한다.
   * 
   * 단, 최종 결과에서 1개를 빼준다.(마지막 페이지가 반쪽짜리인 경우를 위한 가상페이지가 항상 존재함.)
   */
  const halfPageCount = Math.round((scrollWidth + gap) / halfPage) - 1;

  /**
   * halfPage 개수가 홀수개인지 확인. -> 홀수개라면 마지막 페이지는 반쪽페이지
   * 페이지 수는 2개의 반페이지를 합쳐서 1개로 세고, 마지막은 반페이지는 1개든 2개든 1개로 셈.
   */
  const isLastFullPage = halfPageCount % 2 === 0;
  const totalPageCount = Math.floor(halfPageCount / 2) + (isLastFullPage ? 0 : 1);

  return {
    gap,
    column,
    halfPage,
    pageBreakPointCommonDifference,
    totalPageCount,
    isLastFullPage
  }
}
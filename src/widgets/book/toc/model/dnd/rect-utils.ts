import { ClientRect } from "@dnd-kit/core"




// top + center + bottom = 1
type SplitRatio = {
  top: number
  center: number
  bottom: number
}
type SplitedRect = {
  top: ClientRect
  center: ClientRect
  bottom: ClientRect
}
const splitRectToThreeVertically = (rect: ClientRect, ratio: SplitRatio): SplitedRect => {
  const ratioSum = ratio.top + ratio.center + ratio.bottom;

  const top = {
    width: rect.width,
    height: rect.height * ratio.top,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.top + rect.height * ratio.top
  }
  const center = {
    width: rect.width,
    height: rect.height * ratio.center,
    top: top.bottom,
    left: rect.left,
    right: rect.right,
    bottom: top.bottom + rect.height * ratio.center
  }
  const bottom = {
    width: rect.width,
    height: rect.height * ratio.bottom,
    top: center.bottom,
    left: rect.left,
    right: rect.right,
    bottom: center.bottom + rect.height * ratio.bottom
  }
  return { top, center, bottom }
}

const getRectCenterY = (rect: ClientRect) => {
  return rect.top + rect.height / 2;
}


const ratio: SplitRatio = {
  top: 0.35,
  center: 0.3,
  bottom: 0.35
}
export const RectUtils = {
  splitRectToThreeHorizontally: (rect: ClientRect) => splitRectToThreeVertically(rect, ratio),
  isRectCenterVerticallyInBoundary: (rect: ClientRect, boundary: ClientRect) => {
    return boundary.top < getRectCenterY(rect) && boundary.bottom > getRectCenterY(rect);
  }
}
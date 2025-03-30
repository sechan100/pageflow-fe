'use client'
import { STYLES } from "@/global/styles"
import { Box } from "@mui/material"
import { indentPerDepth, indicatorZIndex } from "../config"



export type IndicatorMode = {
  mode: "box"
  depth: number
} | {
  mode: "line",
  depth: number
  position: "top" | "bottom"
}


const indicatorLineHeight = 3.3;

/**
 * indicator는 TocNode 안에 배치해야하며, TocNode의 position을 relative로 설정해야한다.
 */
type Props = {
  mode: IndicatorMode | null
}
export const Indicator = ({
  mode,
}: Props) => {

  if (!mode) {
    return null;
  }

  if (mode.mode === "box") {
    return (
      <Box
        sx={{
          zIndex: indicatorZIndex,
          backgroundColor: STYLES.color.primaryHsla({ a: 0.5 }),
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${mode.depth * (indentPerDepth * 8)}px`,
          right: 0,
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        zIndex: indicatorZIndex,
        backgroundColor: STYLES.color.primary,
        position: "absolute",
        top: mode.position === "top" ? 0 : undefined,
        bottom: mode.position === "bottom" ? 0 : undefined,
        left: `${mode.depth * (indentPerDepth * 8)}px`,
        transform: mode.position === "top" ? "translateY(-50%)" : "translateY(50%)",
        right: 0,
        height: indicatorLineHeight,
        // line 맨 앞에 작은 원 장식 추가
        "&:before": {
          content: "''",
          position: "absolute",
          width: indicatorLineHeight * 3,
          height: indicatorLineHeight * 3,
          transform: "translate(-33%, -33%)",
          borderRadius: "50%",
          backgroundColor: STYLES.color.primary,
        }
      }}
    />
  )
}
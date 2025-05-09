'use client'
import { LinearProgress } from "@mui/material";
import { useMemo } from "react";
import { usePageControlStore } from "./container/page-control";
import { usePageMeasurementStore } from "./container/page-measurement";

export const PageProgress = () => {
  const currentPage = usePageControlStore(s => s.currentPage);
  const totalPageCount = usePageMeasurementStore(s => s.totalPageCount);

  const pageProgress = useMemo(() => {
    if (totalPageCount === 0) return 0;
    return (currentPage + 1) / totalPageCount * 100;
  }, [currentPage, totalPageCount]);

  return (
    <>
      <LinearProgress variant="determinate" value={pageProgress} />
    </>
  )
}
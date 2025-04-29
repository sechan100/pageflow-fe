import { create } from "zustand";
import { ScrollContainerSize } from "../ui/reading-unit/scroll-container-size";
import { PageMeasurement } from "../ui/reading-unit/page-measurement";



type ContainerPageMeasurementStore = {
  containserSize: ScrollContainerSize;
  pageMeasurement: PageMeasurement;
}

export const useContainerPageMeasurementStore = create<ContainerPageMeasurementStore>(() => ({
  containserSize: {
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollLeft: 0,
  },
  pageMeasurement: {
    column: 0,
    gap: 0,
    halfPage: 0,
    isLastFullPage: false,
    pageBreakPointCommonDifference: 0,
    totalPageCount: 0,
  }
}));
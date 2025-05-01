import { create } from "zustand";
import { PageMeasurement } from "../model/page-measurement";
import { ScrollContainerSize } from "../model/scroll-container-size";



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
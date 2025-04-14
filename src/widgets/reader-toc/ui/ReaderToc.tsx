'use client'
import { ZustandStore } from "@/shared/zustand/zustand-store";
import { Box, SxProps } from "@mui/material";
import { ReaderTocStore, ReaderTocStoreContextProvider } from "../model/toc-context";



type Props = {
  tocStore: ZustandStore<ReaderTocStore>;
  sx?: SxProps;
}
export const ReaderToc = ({
  tocStore,
  sx
}: Props) => {

  return (
    <ReaderTocStoreContextProvider value={tocStore}>
      {/* <ReaderTocSidebar /> */}
      <Box>
        안녕 난 toc야.
      </Box>
    </ReaderTocStoreContextProvider>
  )
}
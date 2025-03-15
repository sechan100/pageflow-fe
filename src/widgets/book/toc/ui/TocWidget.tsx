'use client'
import { SvToc } from "@/entities/book";
import { Box, SxProps } from "@mui/material";
import { useEffect, useState } from "react";
import { mergeServerToc } from "../model/merge-toc";
import { Toc } from "../model/toc.type";
import { UseTocProvider } from "../model/use-toc";
import { TocRoot } from "./TocRoot";
import { TocToolBar } from "./TocToolBar";


type Props = {
  svToc: SvToc;
  sx?: SxProps
}
export const TocWidget = ({
  svToc,
  sx
}: Props) => {
  const [toc, setToc] = useState<Toc | null>(null);

  // 새로운 svToc가 들어오면, 기존 toc와 병합하여 새로운 toc를 만든다.
  useEffect(() => {
    setToc(mergeServerToc(svToc, toc));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svToc]);

  if (!toc) {
    return <div>toc merging...</div>
  }

  return (
    <UseTocProvider data={toc} onDataChange={(s, toc) => s.setState({ toc })}>
      <TocToolBar />
      <Box
        sx={{
          overflowY: "auto",
          height: "100%",
        }}
      >
        <TocRoot />
      </Box>
    </UseTocProvider>
  )
}
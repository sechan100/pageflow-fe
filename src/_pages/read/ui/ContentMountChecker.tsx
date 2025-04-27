'use client'
import { SxProps } from "@mui/material";
import { useEffect } from "react";
import { readerEvent } from "../model/reader-event";



type Props = {
  sx?: SxProps;
}
export const ContentMountChecker = ({
  sx
}: Props) => {
  useEffect(() => {
    readerEvent.emit("content-mounted")
  }, [])

  return (
    <>

    </>
  )
}
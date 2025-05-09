'use client'
import { SpeedDial, SpeedDialAction, SpeedDialIcon, SxProps } from "@mui/material";
import { AArrowDown, AArrowUp, Cog, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { DEFAULT_READER_STYLE, useReaderStyleStore } from "../stores/reader-style-store";

type DialAction = {
  icon: React.ReactNode;
  name: string;
  cb: () => void;
}

const updateReaderFontSize = (size: "up" | "down") => {
  const { fontSize } = useReaderStyleStore.getState();
  const newFontSize = {
    fontSize: size === "up" ? fontSize + 1 : fontSize - 1
  }
  useReaderStyleStore.setState(newFontSize);
}

const resetReaderFontSize = () => {
  useReaderStyleStore.setState({
    fontSize: DEFAULT_READER_STYLE.fontSize
  });
}

type Props = {
  sx?: SxProps
}
export const ReadPageDialMenu = ({
  sx
}: Props) => {
  const mainDial: DialAction = useMemo(() => ({
    icon: <SpeedDialIcon icon={<Cog />} />,
    name: "Main",
    cb: () => { }
  }), []);

  const dialActions: DialAction[] = useMemo(() => ([
    {
      icon: <AArrowDown />,
      name: "글자크기 줄이기",
      cb: () => updateReaderFontSize("down")
    },
    {
      icon: <AArrowUp />,
      name: "글자크기 키우기",
      cb: () => updateReaderFontSize("up")
    },
    {
      icon: <RotateCcw />,
      name: "초기화",
      cb: () => resetReaderFontSize()
    },
  ]), []);

  return (
    <>
      <SpeedDial
        ariaLabel="editor dial"
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 50,
        }}
        icon={mainDial.icon}
        onClick={mainDial.cb}
        direction="up"
      >
        {dialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name
              }
            }}
            onClick={action.cb}
          />
        ))}
      </SpeedDial>
    </>
  )
}
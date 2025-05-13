'use client'
import { Button, ButtonProps } from "@mui/material";
import { useCallback, useMemo } from "react";



type Props = ButtonProps & {
  flag: boolean;
  setFlag: (value: boolean) => void;
  toTrue: React.ReactNode;
  toFalse: React.ReactNode;
}
export const FlaggableButton = (props: Props) => {
  const buttonProps = useMemo(() => {
    const { flag, setFlag, toTrue, toFalse, ...rest } = props;
    return rest;
  }, [props]);

  const handleToggle = useCallback((e: unknown) => {
    props.onClick?.(e as any);
    props.setFlag(!props.flag);
  }, [props]);

  return (
    <Button
      onClick={handleToggle}
      {...buttonProps}
    >
      {props.flag ? props.toFalse : props.toTrue}
    </Button>
  )
}
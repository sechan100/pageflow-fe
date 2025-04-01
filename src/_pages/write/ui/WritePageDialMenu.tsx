'use client'
import { useWritePageDialMenuStore } from '@/features/book';
import { SpeedDial, SpeedDialAction, SxProps } from "@mui/material";


type Props = {
  sx?: SxProps
}
export const WritePageDialMenu = ({
  sx
}: Props) => {
  const mainDial = useWritePageDialMenuStore(s => s.mainDial);
  const dialActions = useWritePageDialMenuStore(s => s.dialActions);

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
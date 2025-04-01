import { FileCopy } from "@mui/icons-material";
import { PrinterIcon, SaveIcon, ShareIcon } from "lucide-react";
import React from "react";
import { create } from "zustand";


type DialAction = {
  icon: React.ReactNode;
  name: string;
  cb: () => void;
}

type DialActionCleanup = () => void;

const fallbackDial: DialAction = {
  icon: <></>,
  name: "",
  cb: () => { },
};

type WritePageDialMenuStore = {
  mainDial: DialAction;
  dialActions: DialAction[];
  setMainDial: (mainDial: DialAction) => DialActionCleanup;
  addDialAction: (action: DialAction) => DialActionCleanup;
  clearDial: () => void;
}
export const useWritePageDialMenuStore = create<WritePageDialMenuStore>((set) => ({
  mainDial: fallbackDial,

  dialActions: [
    { icon: <FileCopy />, name: 'Copy', cb: () => { } },
    { icon: <SaveIcon />, name: 'Save', cb: () => { } },
    { icon: <PrinterIcon />, name: 'Print', cb: () => { } },
    { icon: <ShareIcon />, name: 'Share', cb: () => { } },
  ],

  setMainDial: (mainDial) => {
    set({ mainDial });
    return () => {
      set({ mainDial: fallbackDial });
    }
  },

  addDialAction: (action) => {
    set((state) => ({
      dialActions: [...state.dialActions, action],
    }));
    return () => {
      set((state) => ({
        dialActions: state.dialActions.filter((a) => a !== action),
      }));
    };
  },

  clearDial: () => {
    set({
      mainDial: fallbackDial,
      dialActions: [],
    });
  },
}));
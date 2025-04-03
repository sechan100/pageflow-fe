import { SpeedDialIcon } from "@mui/material";
import { SaveIcon } from "lucide-react";
import React from "react";
import { create } from "zustand";


type DialAction = {
  icon: React.ReactNode;
  name: string;
  cb: () => void;
}

type DialActionWithOrder = DialAction & {
  orderWeight: number
}

type DialActionCleanup = () => void;

const fallbackDial: DialAction = {
  icon: <SpeedDialIcon openIcon={<SaveIcon />} />,
  name: "",
  cb: () => { },
};

type WritePageDialMenuStore = {
  mainDial: DialAction;
  dialActions: DialActionWithOrder[];
  setMainDial: (mainDial: DialAction) => DialActionCleanup;
  /**
   * 
   * @param action 
   * @param orderWeight 순서를 결정하는 가중치
   * @returns 
   */
  addDialAction: (action: DialAction, orderWeight?: number) => DialActionCleanup;
  clearDial: () => void;
}
export const useWritePageDialMenuStore = create<WritePageDialMenuStore>((set, get) => ({
  mainDial: fallbackDial,

  dialActions: [],

  setMainDial: (mainDial) => {
    set({ mainDial });
    return () => {
      set({ mainDial: fallbackDial });
    }
  },

  addDialAction: (action, orderWeight) => {
    set((state) => ({
      dialActions: [
        ...state.dialActions,
        {
          ...action,
          orderWeight: orderWeight ?? 0,
        },
      ].sort((a, b) => a.orderWeight - b.orderWeight),
    }));

    return () => {
      set((state) => ({
        dialActions: state.dialActions.filter((a) => a.name !== action.name),
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
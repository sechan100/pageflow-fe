'use client';

import { create } from 'zustand';
import { useNotificationsStore } from './notificationsStore';
import type { CloseNotification, ShowNotification } from './types';


export type UseNotification = {
  show: ShowNotification;
  close: CloseNotification;
  info: (message: string) => void;
  success: (message: string) => void;
  warn: (message: string) => void;
  error: (message?: string) => void;
};

export const AUTO_HIDE_DURATION = 7000;

export const useNotification = create<UseNotification>((set, get) => ({
  show: useNotificationsStore.getState().show,
  close: useNotificationsStore.getState().close,
  info: (message: string) => get().show(message, { severity: "info", autoHideDuration: AUTO_HIDE_DURATION }),
  success: (message: string) => get().show(message, { severity: "success", autoHideDuration: AUTO_HIDE_DURATION  }),
  warn: (message: string) => get().show(message, { severity: "warning", autoHideDuration: AUTO_HIDE_DURATION }),
  error: (message?: string) => {
    if(message){
      get().show(message, { severity: "error", autoHideDuration: AUTO_HIDE_DURATION});
    } else {
      get().show("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", { severity: "error", autoHideDuration: AUTO_HIDE_DURATION});
    }
  }
}));
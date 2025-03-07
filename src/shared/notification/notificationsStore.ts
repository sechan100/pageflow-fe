'use client';

import { create } from 'zustand';
import React from 'react';
import type { ShowNotificationOptions, UseNotifications } from './types';

// 고유 ID 생성을 위한 카운터
let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return `::notification::${id}`;
};

interface Notification {
  id: string;
  message: React.ReactNode;
  options: ShowNotificationOptions;
}

interface NotificationsState extends UseNotifications {
  queue: Notification[];
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  queue: [],
  
  show: (message, options = {}) => {
    const key = options.key ?? generateId();
    
    set((state) => {
      // 같은 키를 가진 알림이 있으면 중복 제거
      if(state.queue.some(n => n.id === key)) {
        return state;
      }
      
      return {
        ...state,
        queue: [
          ...state.queue, 
          { 
            id: key, 
            message, 
            options 
          }
        ]
      };
    });
    
    return key;
  },
  
  close: (key) => {
    set((state) => ({
      ...state,
      queue: state.queue.filter(n => n.id !== key)
    }));
  }
}));
import { ShowNotificationOptions } from "@/shared/notification";




export type NotificationReserve = {
  severity: ShowNotificationOptions['severity'];
  message: string;
}

/**
 * ErrorCatchProvider에서 처리가능한 에러타입을 정의한다.
 */
export abstract class ProcessResultError extends Error {
  constructor(message: string) {
    super(message);
  }

  abstract getNotification(): NotificationReserve;
}
import { NotificationReserve, ProcessResultError } from "../ProcessResultError";




export class SessionExpiredError extends ProcessResultError {
  constructor(message = '세션이 만료되었습니다.') {
    super(message);
    this.name = 'SessionExpiredError';
  }
  
  override getNotification(): NotificationReserve {
    return {
      severity: 'warning',
      message: "로그인이 만료되었습니다. 다시 로그인해주세요."
    }
  }
}
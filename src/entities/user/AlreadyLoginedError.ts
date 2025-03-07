import { NotificationReserve, ProcessResultError } from "@/global/ProcessResultError";





export class AlreadyLoginedError extends ProcessResultError {
  constructor() {
    super("이미 로그인된 상태입니다.")
  }

  getNotification(): NotificationReserve {
    return {
      message: "이미 로그인중입니다.",
      severity: "warning"
    }
  }
}

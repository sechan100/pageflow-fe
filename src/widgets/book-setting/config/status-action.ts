import { StatusAction } from "../model/status-action";


type StatusActionInfo = {
  text: string;
}

export const statusActionConfig: Record<StatusAction, StatusActionInfo> = {
  publish: {
    text: '출판하기',
  },
  "start-revision": {
    text: '개정하기',
  },
  revise: {
    text: '개정하기',
  },
  "cancel-resivion": {
    text: '개정 취소',
  },
}
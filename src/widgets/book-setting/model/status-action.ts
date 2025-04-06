import { BookStatus } from "@/entities/book";
import { ServerBookStatusCmd } from "../api/change-book-status";


export type StatusAction = "publish" | "start-revision" | "revise" | "cancel-resivion";

/**
 * currentStatus에 따라 현재 실행 가능한 StatusAction들을 반환합니다.
 * @returns 
 */
export const resolveStatusActions = (currentStatus: BookStatus): StatusAction[] => {
  const changeableStatuses: StatusAction[] = [];

  switch (currentStatus) {
    case "DRAFT":
      changeableStatuses.push("publish");
      break;
    case "PUBLISHED":
      changeableStatuses.push("start-revision");
      break;
    case "REVISING":
      changeableStatuses.push("revise", "cancel-resivion");
      break;
    default:
      throw new Error(`Unknown status: ${currentStatus}`);
  }

  return changeableStatuses;
}


type ClientStatusAction = {
  action: StatusAction;
  dontRiseEdition?: boolean;
}

/**
 * StatusAction에 따라 서버에 전달할 명령어를 반환합니다.
 */
export const resolveServerStatusActionCmd = (clientAction: ClientStatusAction): ServerBookStatusCmd => {
  const action = clientAction.action;

  // dontRiseEdition는 action이 "revise"일 때만 제공
  if (action === "revise" && clientAction.dontRiseEdition === undefined) {
    throw new Error(`dontRiseEdition is required for revise action`);
  }
  if (action !== "revise" && clientAction.dontRiseEdition !== undefined) {
    throw new Error(`dontRiseEdition is not allowed for ${action} action`);
  }


  switch (action) {
    case "publish":
      return "PUBLISH";

    case "start-revision":
      return "START_REVISION";

    case "revise":
      if (clientAction.dontRiseEdition) {
        return "MERGE_REVISION";
      } else {
        return "PUBLISH";
      }

    case "cancel-resivion":
      return "CANCEL_REVISION";

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
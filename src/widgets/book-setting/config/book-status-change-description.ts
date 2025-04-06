import { StatusAction } from "../model/status-action";


export const dontRiseEditionDescription = `판본을 변경하지 않고 개정`

export const bookStatusChangeDescription: Record<StatusAction, string> = {
  publish: `
  <p>
    책을 <u>출판</u> 상태로 변경합니다.
  </p>
  <p>
    출판되면 <strong>다른 사용자들이 이 책을 볼 수 있게</strong> 됩니다.
    이를 원치 않을 경우 '공개 범위 설정'에서 조정할 수 있습니다.
  </p>
  <p>
    출판된 이후에는 책의 제목, 내용, 목차 등을 <strong>수정하는 것이 제한</strong>되며, 필요한 경우 <u>개정</u>을 시작하여 변경할 수 있습니다.
  </p>
  `,

  "start-revision": `
  <p>
    개정을 시작하면 기존의 출판된 내용인 <strong>출판본</strong>을 기반으로 새로운 <strong>개정본</strong>이 생성됩니다.<br />
    개정을 시작해도 <strong>출판본은 여전히 유효하며, 다른 사용자들에게 공개</strong>됩니다.
    이를 원치 않을 경우 '공개 범위 설정'에서 조정할 수 있습니다.
  </p>
  <p>
    출판본과 별개로, <strong>개정본</strong>은 다양한 사항들을 수정할 수 있게되며, 개정을 완료하기 전까지 출판본과 별도로 유지됩니다.<br />
    <u>개정을 완료</u>하면 <strong>개정본이 출판본으로 변경</strong>되고 기존 출판본은 삭제되며, 도중에 개정이 필요없어진 경우 <u>취소</u>할 수 있습니다.
  </p>
  `,

  revise: `
  <p>
    개정을 완료하면 현재 수정한 내용인 <strong>개정본</strong>이 <strong>출판본</strong>으로 변경됩니다.
  </p>
  <p>
    기존의 출판본은 삭제되며, 개정본이 새로운 출판본으로 대체됩니다.<br />
    최초 개정한 경우 <strong>판본이 초판에서 개정판으로 변경</strong>되며, 이후 개정이 진행될 때 마다 '개정 2판', '개정 3판'과 같이 변경됩니다.<br />
    <strong>한번 개정된 이후에는 되돌릴 수 없습니다.</strong><br />
  </p>
  <p>
    맞춤법교정과 같이 아주 가볍거나 실제 내용에는 거의 영향이 없는 수정사항인 경우 경우,
    아래 '<u>${dontRiseEditionDescription}</u>' 옵션에 체크하여 판본변경 없이 내용을 수정할 수 있습니다.<br />
    이 경우 일반적인 개정처럼 처리되지만, 판본은 기존 그대로 유지됩니다.<br />
    다만, <strong>실제 내용에 변경이 있는 경우 판본을 변경하는 것이 좋습니다.</strong>
  </p>
  `,

  "cancel-resivion": `
  <p>
    개정을 취소하면 <strong>현재 수정된 내용이 포함된 개정본은 삭제</strong>되며, 기존의 출판본이 그대로 유지됩니다.<br />
    책은 <u>출판</u>상태로 변경됩니다.
  </p>
  `,
}
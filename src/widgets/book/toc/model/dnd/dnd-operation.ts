import { Active, Over } from "@dnd-kit/core";
import { RelocateForm } from "../../api/relocate-node";
import { IndicatorMode } from "../../ui/Indicator";
import { Toc } from "../toc.type";
import { InsertAboveOperation } from "./InsertAboveOperation";
import { InsertBelowOperation } from "./InsertBelowOperation";
import { InsertFirstIntoOperation } from "./InsertFirstIntoOperation";
import { InsertLastIntoOperation } from "./InsertLastIntoOperation";


export type DndOperationContext = {
  toc: Toc;
  active: Active;
  over: Over;
  overDepth: number;
}

export type RelocateResult =  {
  form: RelocateForm;
  toc: Toc;
}



export interface DndOperation {
  /**
   * 해당 operation이 현재 context에서 수행 가능한지 여부를 반환한다.
   * 2개 이상의 operation이 동시에 수행 가능한 경우, operation을 특정할 수 없어 에러가 발생할 수 있다.
   */
  isAcceptable(context: DndOperationContext): boolean;

  getIndicatorMode(context: DndOperationContext): IndicatorMode;

  /**
   * 해당 operation을 수행하고 새로운 Toc 데이터와 이를 서버에 동기화하기 위한 form을 함께 반환한다.
   */
  relocate(context: DndOperationContext): RelocateResult;
}


const operations: DndOperation[] = [
  new InsertAboveOperation(),
  new InsertBelowOperation(),
  new InsertFirstIntoOperation(),
  new InsertLastIntoOperation(),
];

export const DndOperationDispatcher = {
  dispatch: (context: DndOperationContext): DndOperation | null => {
    const acceptableOperations = operations.filter(op => op.isAcceptable(context));
    switch(acceptableOperations.length){
      case 0: 
        return null;
      case 1:
        return acceptableOperations[0];
      default:
        throw new Error("수행 가능한 operation을 특정할 수 없습니다: " + acceptableOperations.map(op => op.constructor.name).join(", "));
    }
  }
}
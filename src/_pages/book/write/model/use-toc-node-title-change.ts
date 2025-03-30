import { Toc, TocOperations, useTocStore } from '@/entities/book';
import { produce } from 'immer';





export const useTocNodeTitleChange = () => {
  const toc = useTocStore(s => s.toc);
  const setToc = useTocStore(s => s.setToc);

  const changeNodeTitle = (nodeId: string, title: string) => {
    const newToc = produce<Toc>(toc, draft => {
      const targetNode = TocOperations.findNode(draft, nodeId);
      targetNode.title = title;
      return draft;
    });
    setToc(newToc);
  }

  return {
    changeNodeTitle
  }
}
import { Folder, SectionWithContent, TocFolder, TocNode, TocOperations, TocSection, useEditorBookStore, useTocStore } from "@/entities/book";
import { api } from "@/global/api";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";




type Form = {
  bookId: string;
  type: 'section' | 'folder';
  parentNodeId: string;
  title: string;
}

type CreateNewNodeResult = {
  success: true;
  node: Folder | SectionWithContent;
} | {
  success: false;
  message: string;
}

const createNewNodeApi = async ({ bookId, type, parentNodeId, title}: Form) => {
  const res = await api
  .user()
  .data({
    parentNodeId,
    title
  })
  .post<Folder | SectionWithContent>(`/user/books/${bookId}/toc/${type}s`);

  return res.resolver<CreateNewNodeResult>()
  .SUCCESS((data) => ({
    success: true,
    node: data
  }))
  .resolve();
}

type CreateNodeCmd = {
  type: 'section' | 'folder';
  parentNodeId: string;
  title: string;
}


export const useCreateTocNodeMutation = () => {
  const { id: bookId } = useEditorBookStore(s => s.book);
  const toc = useTocStore(s => s.toc);
  const setToc = useTocStore(s => s.setToc);
  const setFolderOpen = useTocStore(s => s.setFolderOpen);

  const addNode = ({ parentNodeId, node }: { parentNodeId: string, node: TocNode }) => {
    const newToc = produce(toc, draft => {
      const parentNode = TocOperations.findFolder(draft, parentNodeId);
      parentNode.children = [
        ...parentNode.children,
        node
      ]
      return draft;
    });

    if(node.type === 'folder'){
      // 새로 생성한 폴더는 열어둔다.
      setFolderOpen(node.id, true);
    }
    setToc(newToc);
  }

  return useMutation({
    mutationFn: ({ type, parentNodeId, title }: CreateNodeCmd) => createNewNodeApi({
      bookId,
      type,
      parentNodeId,
      title
    }),
    onSuccess: (res, { parentNodeId }) => {
      if(!res.success) return;

      // Folder \ SectionWithContent 타입을 TocNode 타입으로 변환
      let node: TocNode;
      if("content" in res.node && typeof res.node.content === "string"){
        node = {
          id: res.node.id,
          title: res.node.title,
          type: 'section',
        } as TocSection;
      } else {
        node = {
          id: res.node.id,
          title: res.node.title,
          type: 'folder',
          children: [],
        } as TocFolder;
      }

      addNode({ parentNodeId, node });
    }
  });

}
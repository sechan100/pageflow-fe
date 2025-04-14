import { EditorFolder, EditorTocFolder, EditorTocNode, EditorTocSection, TocOperations, WithContentEditorSection } from "@/entities/editor";
import { api } from "@/global/api";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useBookContext } from "../model/book-context";
import { useEditorTocStore } from "../model/editor-toc-store-context";




type Form = {
  bookId: string;
  type: 'section' | 'folder';
  parentNodeId: string;
  title: string;
}

type CreateNewNodeResult = {
  success: true;
  node: EditorFolder | WithContentEditorSection;
} | {
  success: false;
  message: string;
}

const createNewNodeApi = async ({ bookId, type, parentNodeId, title }: Form) => {
  const res = await api
    .user()
    .data({
      parentNodeId,
      title
    })
    .post<EditorFolder | WithContentEditorSection>(`/user/books/${bookId}/toc/${type}s`);

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
  const { id: bookId } = useBookContext();
  const toc = useEditorTocStore(s => s.toc);
  const setToc = useEditorTocStore(s => s.setToc);
  const setFolderOpen = useEditorTocStore(s => s.setFolderOpen);

  const addNode = ({ parentNodeId, node }: { parentNodeId: string, node: EditorTocNode }) => {
    const newToc = produce(toc, draft => {
      const parentNode = TocOperations.findFolder(draft, parentNodeId);
      parentNode.children = [
        ...parentNode.children,
        node
      ]
      return draft;
    });

    if (node.type === 'FOLDER') {
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
      if (!res.success) return;

      // Folder \ SectionWithContent 타입을 TocNode 타입으로 변환
      let node: EditorTocNode;
      if ("content" in res.node && typeof res.node.content === "string") {
        node = {
          id: res.node.id,
          title: res.node.title,
          type: 'SECTION',
        } as EditorTocSection;
      } else {
        node = {
          id: res.node.id,
          title: res.node.title,
          type: 'FOLDER',
          children: [],
        } as EditorTocFolder;
      }

      addNode({ parentNodeId, node });
    }
  });

}
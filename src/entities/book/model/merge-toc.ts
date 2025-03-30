import { SvToc, SvTocFolder, SvTocNode, SvTocSection } from '..';
import { NodeTypeGuard, Toc, TocFolder, TocNode, TocNodeType, TocSection } from "./toc.type";


/**
 * 서버의 값으로 덮어씌워진 node를 표현한다.
 */
type MergedNode = {
  id: string;
  type: TocNodeType;
  merged: {
    field: string;
    value: any;
  }[]
}

type TocMergeContext = {
  mergedNodes: MergedNode[];
}

const addMergedField = (context: TocMergeContext, node: TocNode, { field, value }: { field: string, value: any }) => {
  const mergedNode = context.mergedNodes.find(n => n.id === node.id);
  if(mergedNode) {
    mergedNode.merged.push({ field, value });
  } else {
    context.mergedNodes.push({
      id: node.id,
      type: node.type,
      merged: [{ field, value }]
    })
  }
}

/**
 * id가 같은 두 Section을 병합
 * clientSection가 null인 경우, serverSection를 clientSection type으로 변환하여 반환
 */
const mergeSection = ({ serverSection, clientSection, context }: {
  serverSection: SvTocSection;
  clientSection: TocSection | null;
  context: TocMergeContext
}): TocSection => {
  if(!clientSection) {
    return {
      id: serverSection.id,
      type: 'section',
      title: serverSection.title,
    }
  }

  if(serverSection.title !== clientSection.title) {
    addMergedField(context, clientSection, {
      field: 'title',
      value: serverSection.title,
    })
  }
  return {
    ...clientSection,
    title: serverSection.title,
  }
}

const mergeChildren = ({ serverChildren, clientChildren, context }: {
  serverChildren: SvTocNode[];
  clientChildren: TocNode[];
  context: TocMergeContext;
}): TocNode[] => {
  return serverChildren.map(serverChild => {
    const clientChild = clientChildren.find(c => c.id === serverChild.id);
    if(clientChild) {
      // client와 server 모두에 존재하는 child
      switch(serverChild.type) {

        case 'FOLDER':
          if(!NodeTypeGuard.isFolder(clientChild)) throw new Error("serverChild가 Folder 타입이 아닙니다.");
          return mergeFolder({
            serverFolder: serverChild as SvTocFolder,
            clientFolder: clientChild,
            context
          });

        case 'SECTION':
          if(!NodeTypeGuard.isSection(clientChild)) throw new Error("serverChild가 Section 타입이 아닙니다.");
          return mergeSection({
            serverSection: serverChild as SvTocSection,
            clientSection: clientChild,
            context
          });

        default:
          throw new Error("알 수 없는 노드 타입입니다.");
      }
    } else {
      // server에만 존재하는 child
      switch(serverChild.type) {
        
        case 'FOLDER':
          return mergeFolder({
            serverFolder: serverChild as SvTocFolder,
            clientFolder: null,
            context
          });

        case 'SECTION':
          return mergeSection({
            serverSection: serverChild as SvTocSection,
            clientSection: null,
            context
          });

        default:
          throw new Error("알 수 없는 노드 타입입니다.");
      }
    }
  })
}

/**
 * id가 같은 두 Folder를 병합
 * clientFolder가 null인 경우, serverFolder를 clientFolder type으로 변환하여 반환
 */
const mergeFolder = ({ serverFolder, clientFolder, context }: {
  serverFolder: SvTocFolder;
  clientFolder: TocFolder | null;
  context: TocMergeContext
}): TocFolder => {
  if(!clientFolder) {
    return {
      id: serverFolder.id,
      type: 'folder',
      title: serverFolder.title,
      children: mergeChildren({
        serverChildren: serverFolder.children,
        clientChildren: [],
        context
      })
    }
  }

  if(serverFolder.title !== clientFolder.title) {
    addMergedField(context, clientFolder, {
      field: 'title',
      value: serverFolder.title,
    })
  }
  return {
    ...clientFolder,
    title: serverFolder.title,
    children: mergeChildren({
      serverChildren: serverFolder.children,
      clientChildren: clientFolder.children,
      context
    })
  }
}

/**
 * useTocQuery로 받와왔을(추정) toc 데이터와 client에서 수정중이었던 toc 데이터를 병합하는 함수
 */
export const mergeServerToc = (serverToc: SvToc, clientToc: Toc | null): Toc => {
  const context: TocMergeContext = {
    mergedNodes: []
  }

  const newToc = {
    ...serverToc,
    root: mergeFolder({
      serverFolder: serverToc.root,
      clientFolder: clientToc?.root ?? null,
      context
    })
  }
  console.debug(context.mergedNodes);
  return newToc;
}
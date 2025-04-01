import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { useMemo } from "react";



type CurrentNodeInfo = {
  nodeId: string | null;
  nodeType: 'folder' | 'section' | 'none';
}

/**
 * 현재 편집중인 Node의 정보를 가져온다.(uri에서)
 */
export const useCurrentNode = (): CurrentNodeInfo => {
  const { params } = useNextRouter();

  const nodeType = useMemo(() => {
    if (params.folderId || typeof params.folderId === 'string') {
      return 'folder';
    } else if(params.sectionId && typeof params.sectionId === 'string') {
      return 'section';
    } else {
      return "none";
    }
  }, [params]);
  
  const nodeId = useMemo(() => {
    if (nodeType === 'folder') {
      return params.folderId as string;
    } else if(nodeType === 'section') {
      return params.sectionId as string;
    } else {
      return null;
    }
  }, [nodeType, params]);


  return {
    nodeId: nodeId,
    nodeType: nodeType
  }
}
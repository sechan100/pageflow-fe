'use client'
import { useTocStore } from '@/entities/book'
import { SingleTextFieldModal } from '@/shared/components/SingleTextFieldModal'
import { Field } from '@/shared/field'
import { useNotification } from '@/shared/notification'
import { Box, Button, Divider, SxProps } from "@mui/material"
import { FilePen, FolderPen, Maximize2, Minimize2 } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { useCreateTocNodeMutation } from '../api/create-new-node'
import { useCreateNodeParentResolve } from '../model/use-create-node-parent-resolve'
import { CreateNodeTitleField } from './CreateNodeTitleField'



type ToolIconProps = {
  icon: React.ReactNode;
  onClick: () => void;
}
const ToolIcon = ({
  icon,
  onClick,
}: ToolIconProps) => {

  return (
    <Button
      variant="text"
      startIcon={icon}
      onClick={onClick}
      sx={{
        p: 0,
        minWidth: 0,
        "& .MuiButton-startIcon": {
          margin: 0,
          padding: 0.2,
        }
      }}
    />
  )
}


type Props = {
  sx?: SxProps
}
export const TocToolBar = ({
  sx
}: Props) => {
  const expendAll = useTocStore(s => s.expendAllFolders);
  const collapseAll = useTocStore(s => s.collapseAllFolders);
  const notification = useNotification();

  const { mutateAsync: createTocNode } = useCreateTocNodeMutation();
  const { resolveCreateNodeParentNode } = useCreateNodeParentResolve();
  const [createNodeModalOpen, setCreateNodeModalOpen] = useState(false);
  const [createNodeType, setCreateNodeType] = useState<'section' | 'folder'>('section');
  const [title, setTitle] = useState<Field>({ value: '', error: null });

  // create node modal이 열리면 title 필드를 초기화
  useEffect(() => {
    if (createNodeModalOpen) {
      setTitle({ value: '', error: null });
    }
  }, [createNodeModalOpen]);

  // createNodeType과 title이 완성되면 서버에 요청
  const createNewNode = useCallback(async (title: string) => {
    const parentNode = resolveCreateNodeParentNode(createNodeType);
    const res = await createTocNode({
      type: createNodeType,
      title,
      parentNodeId: parentNode.id
    });

    if (!res.success) {
      notification.error(res.message);
      return;
    }
  }, [createNodeType, createTocNode, notification, resolveCreateNodeParentNode]);


  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          px: 1,
          gap: 1,
        }}
      >
        <ToolIcon
          icon={<Maximize2 />}
          onClick={expendAll}
        />
        <ToolIcon
          icon={<Minimize2 />}
          onClick={collapseAll}
        />
        <ToolIcon
          icon={<FolderPen />}
          onClick={() => {
            setCreateNodeType('folder');
            setCreateNodeModalOpen(true);
          }}
        />
        <ToolIcon
          icon={<FilePen />}
          onClick={() => {
            setCreateNodeType('section');
            setCreateNodeModalOpen(true);
          }}
        />
      </Box>
      <SingleTextFieldModal
        open={createNodeModalOpen}
        onClose={() => setCreateNodeModalOpen(false)}
        fieldComponent={
          <CreateNodeTitleField
            title={title}
            onChange={setTitle}
          />
        }
        modalTitle={`새로운 ${createNodeType === 'folder' ? '폴더' : '섹션'} 추가`}
        submitDisabled={!!title.error}
        onSubmit={() => createNewNode(title.value)}
      />
      <Divider />
    </>
  )
}
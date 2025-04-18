import { FolderDesign } from "@/entities/book";



export type ReadOnlyFolder = {
  id: string;
  title: string;
  folderDesign: FolderDesign;
}

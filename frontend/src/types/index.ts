export interface Folder {
    id: number;
    name: string;
    parentId: number | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FileItem {
    id: number;
    name: string;
    folderId: number;
    size: number;
    mimeType: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FolderTree extends Folder {
    children?: FolderTree[];
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
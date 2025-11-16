import axios from 'axios';
import type { Folder, FileItem, FolderTree, ApiResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const folderApi = {
  getAllFolders: () => api.get<ApiResponse<Folder[]>>('/folders'),
  getFolderTree: () => api.get<ApiResponse<FolderTree[]>>('/folders/tree'),
  getSubFolders: (parentId: number | null) => 
    api.get<ApiResponse<Folder[]>>(`/folders/${parentId === null ? 'root' : parentId}/subfolders`),
  getFiles: (folderId: number) => 
    api.get<ApiResponse<FileItem[]>>(`/folders/${folderId}/files`),
  searchFolders: (query: string) => 
    api.get<ApiResponse<Folder[]>>('/folders/search', { params: { q: query } }),
};
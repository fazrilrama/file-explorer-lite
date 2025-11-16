import { ref, computed } from 'vue';
import { folderApi } from '../services/api';
import type { Folder, FileItem, FolderTree } from '../types';

export function useFileExplorer() {
  const folders = ref<Folder[]>([]);
  const folderTree = ref<FolderTree[]>([]);
  const selectedFolderId = ref<number | null>(null);
  const subFolders = ref<Folder[]>([]);
  const files = ref<FileItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const expandedIds = ref<Set<number>>(new Set());
  const searchQuery = ref('');

  const loadFolderTree = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await folderApi.getFolderTree();
      if (response.data.success) {
        folderTree.value = response.data.data || [];
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const selectFolder = async (folderId: number | null) => {
    selectedFolderId.value = folderId;
    loading.value = true;
    error.value = null;
    
    try {
      const [foldersResponse, filesResponse] = await Promise.all([
        folderApi.getSubFolders(folderId),
        folderId !== null ? folderApi.getFiles(folderId) : Promise.resolve({ data: { success: true, data: [] } }),
      ]);

      if (foldersResponse.data.success) {
        subFolders.value = foldersResponse.data.data || [];
      }
      
      if (filesResponse.data.success) {
        files.value = filesResponse.data.data || [];
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const toggleFolder = (folderId: number) => {
    if (expandedIds.value.has(folderId)) {
      expandedIds.value.delete(folderId);
    } else {
      expandedIds.value.add(folderId);
    }
  };

  const searchFolders = async (query: string) => {
    searchQuery.value = query;
    if (!query.trim()) {
      await loadFolderTree();
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await folderApi.searchFolders(query);
      if (response.data.success) {
        folders.value = response.data.data || [];
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const selectedFolder = computed(() => {
    if (selectedFolderId.value === null) return null;
    
    const findFolder = (folders: FolderTree[]): Folder | null => {
      for (const folder of folders) {
        if (folder.id === selectedFolderId.value) return folder;
        if (folder.children) {
          const found = findFolder(folder.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findFolder(folderTree.value);
  });

  return {
    folders,
    folderTree,
    selectedFolderId,
    selectedFolder,
    subFolders,
    files,
    loading,
    error,
    expandedIds,
    searchQuery,
    loadFolderTree,
    selectFolder,
    toggleFolder,
    searchFolders,
  };
}
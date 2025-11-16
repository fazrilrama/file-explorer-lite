<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-800">File Explorer</h1>
        
        <div class="relative w-80">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search folders..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            @input="handleSearch"
          />
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading && !folderTree.length" class="flex-1 flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <svg class="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading file system...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center bg-gray-50">
      <div class="text-center text-red-500">
        <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-lg font-semibold mb-2">Error loading data</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Folder Tree -->
      <div class="w-1/3 border-r border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200 bg-white">
          <h2 class="text-sm font-semibold text-gray-700">Folders</h2>
        </div>
        <FolderTree
          :tree="folderTree"
          :selectedId="selectedFolderId"
          :expandedIds="expandedIds"
          @select="handleSelectFolder"
          @toggle="toggleFolder"
        />
      </div>

      <!-- Right Panel - Folder Contents -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200 bg-white">
          <h2 class="text-sm font-semibold text-gray-700">
            {{ selectedFolder ? selectedFolder.name : 'Contents' }}
          </h2>
        </div>
        <FolderContent
          :selectedFolderId="selectedFolderId"
          :folders="subFolders"
          :files="files"
          @selectFolder="handleSelectFolder"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFileExplorer } from './composables/useFileExplorer';
import FolderTree from './components/FolderTree.vue';
import FolderContent from './components/FolderContent.vue';

const {
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
} = useFileExplorer();

let searchTimeout: number | undefined;

const handleSelectFolder = async (folderId: number) => {
  await selectFolder(folderId);
  expandedIds.value.add(folderId);
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchFolders(searchQuery.value);
  }, 300) as any;
};

onMounted(async () => {
  await loadFolderTree();
});
</script>
<template>
    <div class="p-6 overflow-auto h-full bg-white">
      <div v-if="!selectedFolderId" class="flex items-center justify-center h-full text-gray-400">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <p class="text-lg">Select a folder to view its contents</p>
        </div>
      </div>
  
      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <!-- Folders -->
          <div
            v-for="folder in folders"
            :key="`folder-${folder.id}`"
            class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
            @dblclick="$emit('selectFolder', folder.id)"
          >
            <svg class="w-12 h-12 text-yellow-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <span class="text-sm text-gray-800 text-center break-words w-full">
              {{ folder.name }}
            </span>
          </div>
  
          <!-- Files -->
          <div
            v-for="file in files"
            :key="`file-${file.id}`"
            class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
          >
            <svg class="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span class="text-sm text-gray-800 text-center break-words w-full">
              {{ file.name }}
            </span>
            <span class="text-xs text-gray-500 mt-1">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
  
        <!-- Empty State -->
        <div v-if="folders.length === 0 && files.length === 0" class="flex items-center justify-center h-64 text-gray-400">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <p>This folder is empty</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Folder, FileItem } from '../types';
  
  defineProps<{
    selectedFolderId: number | null;
    folders: Folder[];
    files: FileItem[];
  }>();
  
  defineEmits<{
    selectFolder: [id: number];
  }>();
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
</script>
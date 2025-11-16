<template>
    <div class="folder-tree h-full overflow-auto">
      <div v-for="folder in tree" :key="folder.id">
        <FolderTreeItem
          :folder="folder"
          :selectedId="selectedId"
          :expandedIds="expandedIds"
          @select="$emit('select', $event)"
          @toggle="$emit('toggle', $event)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { FolderTree } from '../types';
  import FolderTreeItem from './FolderTreeItem.vue';
  
  defineProps<{
    tree: FolderTree[];
    selectedId: number | null;
    expandedIds: Set<number>;
  }>();
  
  defineEmits<{
    select: [id: number];
    toggle: [id: number];
  }>();
  </script>
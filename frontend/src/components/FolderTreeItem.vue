<template>
    <div>
      <div
        :class="[
          'flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 transition-colors',
          { 'bg-blue-50 border-l-2 border-blue-500': isSelected }
        ]"
        :style="{ paddingLeft: `${level * 20 + 8}px` }"
        @click="$emit('select', folder.id)"
      >
        <button
          v-if="hasChildren"
          @click.stop="$emit('toggle', folder.id)"
          class="mr-1 hover:bg-gray-200 rounded p-1 transition-colors"
        >
          <svg
            v-if="isExpanded"
            class="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <svg
            v-else
            class="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div v-else class="w-6"></div>
        
        <svg
          v-if="isExpanded && hasChildren"
          class="w-4 h-4 text-yellow-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-yellow-500 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        
        <span class="text-sm text-gray-800 select-none">{{ folder.name }}</span>
      </div>
      
      <div v-if="hasChildren && isExpanded">
        <FolderTreeItem
          v-for="child in folder.children"
          :key="child.id"
          :folder="child"
          :selectedId="selectedId"
          :expandedIds="expandedIds"
          :level="level + 1"
          @select="$emit('select', $event)"
          @toggle="$emit('toggle', $event)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import type { FolderTree } from '../types';
  
  const props = withDefaults(
    defineProps<{
      folder: FolderTree;
      selectedId: number | null;
      expandedIds: Set<number>;
      level?: number;
    }>(),
    { level: 0 }
  );
  
  defineEmits<{
    select: [id: number];
    toggle: [id: number];
  }>();
  
  const hasChildren = computed(() => props.folder.children && props.folder.children.length > 0);
  const isExpanded = computed(() => props.expandedIds.has(props.folder.id));
  const isSelected = computed(() => props.selectedId === props.folder.id);
  </script>
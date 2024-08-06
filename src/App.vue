<script setup>
import { usePathStore } from '@/store/pathStore';
const store = usePathStore();
</script>

<template>
  <p><strong>Current route path:</strong> {{ $route.params }}</p>
  <p><strong>Current pinia path:</strong> {{ store.path }}</p>
  <nav>
    <RouterLink :to="{ name: 'Folder', params: { path: '/' } }">文件夹</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>

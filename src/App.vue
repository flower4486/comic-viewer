<script setup></script>

<template>
  <nav>
    <RouterLink :to="{ name: 'Folder', params: { path: '/' } }">文件夹</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>

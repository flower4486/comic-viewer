<script setup></script>

<template>
  <el-button>
    <RouterLink :to="{ name: 'Folder', params: { path: '/' } }">文件夹</RouterLink>
  </el-button>
  <el-button>
    <RouterLink :to="{ name: 'Like' }">收藏</RouterLink>
  </el-button>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
.nav {
  position: absolute;
}
</style>

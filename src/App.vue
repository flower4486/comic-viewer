<script setup>
import { listDirectory, getFileContent } from '@/requests/dav';
import { extractedImages, extractAndDisplayImages } from '@/requests/extract';
let num = $ref(0);
let directoryItems = $ref('');
let zipFile = $ref(null);

//获取压缩包并解压
let davpromise = getFileContent('/漫画/做韵律操的妈妈/第0话.zip');
davpromise.then((res) => {
  console.log('压缩包获取', res);
  zipFile = res;
  extractAndDisplayImages(zipFile);
  console.log('漫画', extractedImages.value);
});

function click() {
  num++;
}
</script>

<template>
  <p>
    {{ num }}
  </p>
  <button @click="click">按钮</button>
  <el-scrollbar height="60%">
    <!-- <p v-for="item in directoryItems" :key="item.basename" class="scrollbar-demo-item">
      <span>{{ item.basename }}</span>
    </p> -->
    <div v-for="item in extractedImages" :key="item">
      <img :src="item" />
    </div>
  </el-scrollbar>
</template>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>

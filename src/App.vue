<script setup>
import { listDirectory, getFileContent } from '@/requests/dav';
import { extractedImages, extractAndDisplayImages, extractAndDisplayImages_sync, compareLabels } from '@/requests/extract';
let num = $ref(0);
let directoryItems = $ref('');
let zipFile = $ref(null);
let show_imgs = $ref([]);
//获取压缩包并解压
let davpromise = getFileContent('/漫画/极品家丁宁坠篇/第0话.zip');
davpromise.then((res) => {
  console.log('压缩包获取', res);
  zipFile = res;
  extractAndDisplayImages_sync(zipFile);
  show_imgs = extractedImages.value;
  // console.log('show_imgs', show_imgs.sort(compareLabels));
  // console.log('show_imgs', show_imgs[13].index);
});

function click() {
  show_imgs.sort(compareLabels);
  console.log('排序后', show_imgs);
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
    <div v-for="item in show_imgs" :key="item.index">
      <img :src="item.img" />
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

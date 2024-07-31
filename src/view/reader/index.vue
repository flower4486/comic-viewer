<template>
  <button @click="orderImg">更正顺序</button>
  <el-scrollbar>
    <div v-for="item in show_imgs" :key="item.index" class="scrollbar-demo-item">
      <img :src="item.img" />
    </div>
  </el-scrollbar>
  <button @click="router_back">返回</button>
</template>

<script setup>
import { getFileContent } from '@/requests/dav';
import { extractedImages, extractAndDisplayImages_sync, compareLabels } from '@/requests/extract';
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();
const route = useRoute();

let show_imgs = $ref([]);
let zipFile = $ref(null);
//获取压缩包并解压
let davpromise = getFileContent(route.params.path);

davpromise.then((res) => {
  console.log('压缩包获取', res);
  zipFile = res;
  extractAndDisplayImages_sync(zipFile);
  show_imgs = extractedImages.value;
  console.log('排序前', show_imgs);
});

watch(route, (newValue, oldValue) => {
  //获取压缩包并解压
  let davpromise = getFileContent(route.params.path);

  davpromise.then((res) => {
    console.log('压缩包获取', res);
    zipFile = res;
    extractAndDisplayImages_sync(zipFile);
    show_imgs = extractedImages.value;
    console.log('排序前', show_imgs);
  });
});

function orderImg() {
  show_imgs.sort(compareLabels);
}
function router_back() {
  console.log('route.params.path', route.params.path);
  router.push({ name: 'Folder', params: { path: route.params.path } });
}
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: left;
  margin: 0;
  height: 100%;
}

.scrollbar-demo-item img {
  max-width: 80%;
  max-height: 100%; /* 添加最大高度限制 */
  object-fit: contain; /* 使用 contain 填充方式 */
}
</style>

<script setup>
import { listDirectory } from '@/requests/dav';
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';

const router = useRouter();
const route = useRoute();
let directoryItems = $ref([
  { basename: '漫画', type: 'directory' },
  { basename: '写真', type: 'directory' },
]);
// let path = $ref('/');

async function updateList() {
  let folder_path = route.params.path.split('/第')[0];
  console.log('folder_path', folder_path);
  let listDir = await listDirectory(folder_path);
  console.log('列表', listDir);
  console.log('排序后', listDir.sort(compareLabels));
  directoryItems = listDir;
}
watch(route, (newValue, oldValue) => {
  // path = newValue.params.path
  console.log('path', newValue.params.path);
  updateList();
});
// 自定义比较函数，根据字符串中的数字部分进行排序
function compareLabels(a, b) {
  const numA = a.basename.match(/\d+/) == null ? a.basename : parseInt(a.basename.match(/\d+/)[0]); // 提取字符串中的数字部分并转为整数
  const numB = b.basename.match(/\d+/) == null ? b.basename : parseInt(b.basename.match(/\d+/)[0]);
  // const numA = parseInt(a.basename.match(/\d+/)[0]); // 提取字符串中的数字部分并转为整数
  // const numB = parseInt(b.basename.match(/\d+/)[0]);
  return numA - numB;
}

function push_path(folder) {
  let path = route.params.path;
  if (path != '/') {
    path = path + '/' + folder;
  } else {
    path = path + folder;
  }
  console.log(path);
  router.push({ name: 'Folder', params: { path: path } });
}

function pop_path() {
  let path = route.params.path;
  const lastSlashIndex = path.lastIndexOf('/');
  path = path.substring(0, lastSlashIndex);
  console.log(path);
  router.push({ name: 'Folder', params: { path: path } });
}
function read(filename) {
  // push_path(filename);
  router.push({ name: 'Reader', params: { path: route.params.path + '/' + filename } });
}
</script>
<template>
  <button @click="updateList">更新文件夹</button>
  <button @click="pop_path">返回上一级</button>
  <el-scrollbar>
    <div>
      <div v-for="item in directoryItems" :key="item" class="scrollbar-demo-item">
        <p>{{ item.basename }}&nbsp;</p>
        <!-- <p>类型：{{ item.type }}&nbsp;</p> -->
        <button v-if="item.type == 'directory'" @click="push_path(item.basename)">></button>
        <button v-else @click="read(item.basename)">阅读</button>
      </div>
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

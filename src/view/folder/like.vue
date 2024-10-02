<template>
  <!-- <button @click="updateList">更新文件夹</button>
  <button @click="pop_path">返回上一级</button> -->
  <div class="grid-container">
    <div v-for="item in history_items" :key="item" class="grid-item">
      <p>{{ item.lname }}&nbsp;</p>
      <!-- <p>类型：{{ item.type }}&nbsp;</p> -->
      <!-- <button v-if="item.type == 'directory'" @click="push_path(item.basename)">></button>
      <button v-else-if="item.type == 'file' && getFileType(item.filename) == 'zip'" @click="readComic(index, item.basename)">阅读漫画</button>
      <button v-else-if="item.type == 'file' && getFileType(item.filename) == 'epub'" @click="readEpub(index, item.basename)">阅读漫画</button> -->

      <!-- <button  >阅读小说</button> -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right">
            <el-icon><CaretBottom /></el-icon>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="readNovel(item.path)">阅读</el-dropdown-item>
            <el-dropdown-item @click="deleNovel(item.lname)">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { selctLikesPost, deleLikePost } from '@/api/novel';
import { useRouter } from 'vue-router';
import { usePathStore } from '@/store/pathStore';
const router = useRouter();
const pathStore = usePathStore();
let history_items = ref([
  { lname: '你好', path: '/n/c' },
  { lname: '你不好', path: '/n/c' },
]);
function comparable(a, b) {
  return b.time - a.time;
}
onMounted(() => {
  selctLikesPost().then((res) => {
    history_items.value = res;
    console.log(history_items.value);
  });
});
watch(
  () => history_items,
  (value, oldValue) => {
    history_items.value.sort(comparable);
    console.log(history_items.value);
  },
  {
    deep: true,
    immediate: true,
  },
);
async function readNovel(path) {
  console.log('path', path);
  pathStore.path = path;
  router.push({ name: 'Folder', params: { path: pathStore.path } });
}
async function deleNovel(lname) {
  await deleLikePost(lname);
}
</script>

<style scoped>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* 控制水平方向上的间距 */
}

.grid-item {
  flex: calc(25% - 20px); /* 设置每个项目的宽度，减去 margin 的部分 */
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  /* color: var(--el-color-primary); */
  color: black;

  display: flex; /* 将 .grid-item 设置为 flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

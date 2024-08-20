<script setup>
import { listDirectory, getFileText, getFileContent } from '@/requests/dav';
import { onMounted } from 'vue';
import { usePathStore } from '@/store/pathStore';
import { useNovelStore } from '@/store/novelStore';
import { getFileType } from '@/utils/utils';
import { getNovelId, uploadNovel, getChapterList, deleNovelPost } from '@/api/novel';
import { ArrowDown } from '@element-plus/icons-vue';
const store = usePathStore();
const novelStore = useNovelStore();

const router = useRouter();
const route = useRoute();
let directoryItems = $ref([
  { basename: '漫画', type: 'directory' },
  { basename: '写真', type: 'directory' },
  { basename: '小说', type: 'directory' },
]);

async function updateList() {
  let folder_path = store.path.split('/第')[0];
  // console.log('folder_path', folder_path);
  let listDir = await listDirectory(folder_path);
  directoryItems = listDir.sort(compareLabels);
  // console.log('directoryItems', directoryItems);
}

onMounted(() => {
  updateList();
});
// 自定义比较函数，根据字符串中的数字部分进行排序
function compareLabels(a, b) {
  const numA = a.basename.match(/\d+/) == null ? a.basename : parseInt(a.basename.match(/\d+/)[0]); // 提取字符串中的数字部分并转为整数
  const numB = b.basename.match(/\d+/) == null ? b.basename : parseInt(b.basename.match(/\d+/)[0]);
  return numA - numB;
}

function push_path(folder) {
  let path = store.path;
  if (path != '/') {
    path = path + '/' + folder;
  } else {
    path = path + folder;
  }

  store.path = path;
  updateList();
}

function pop_path() {
  let path = store.path;
  const lastSlashIndex = path.lastIndexOf('/');
  path = path.substring(0, lastSlashIndex);
  if (path == '') path = '/';

  store.path = path;
  updateList();
}
function readComic(index, filename) {
  store.index = index;
  store.comicFiles = directoryItems;
  // console.log('store.comicFiles', store.comicFiles);
  router.push({ name: 'Comic' });
}
function readEpub(index, filename) {
  store.index = index;
  store.comicFiles = directoryItems;
  // console.log('store.comicFiles', store.comicFiles);
  router.push({ name: 'Epub' });
}

async function readNovel(basename, index) {
  console.log('basename', basename);
  let nid = -1;
  nid = await getNovelId(basename);
  if (nid == -1) {
    //数据库没有小说，上传小说
    try {
      let buff = await getFileText(directoryItems[index].filename);
      const NovelBlob = new Blob([buff]);
      // 创建 File 对象
      const file = new File([NovelBlob], encodeURIComponent(basename), { type: 'text/plain;charset=utf-8' });
      let formData = new FormData();
      // 确保在获取文件内容后再继续处理
      formData.append('file', file);
      // console.log('formdata append', formData.get('file'), basename);
      await uploadNovel(formData).then((res) => {
        window.alert(res);
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    //数据库有小说，先设置好pinia参数，然后直接进入阅读界面
    novelStore.novel_name = basename.split('.')[0];
    //请求章节列表
    novelStore.chapter_dics = await getChapterList(nid);
    // console.log('novelStore.chapter_dics', novelStore.chapter_dics);
    router.push({ name: 'Novel', params: { nid: nid } });
  }
}

async function deleNovel(basename) {
  let nid = -1;
  nid = await getNovelId(basename);
  if (nid == -1) {
    //数据库没有小说，上传小说
    //什么也不做
  } else {
    //数据库有小说，就要删除小说
    await deleNovelPost(nid).then((res) => {
      window.alert(res);
    });
    // console.log('delete res', res);
  }
}
</script>
<template>
  <button @click="updateList">更新文件夹</button>
  <button @click="pop_path">返回上一级</button>
  <div class="grid-container">
    <div v-for="(item, index) in directoryItems" :key="item" class="grid-item">
      <p>{{ item.basename }}&nbsp;</p>
      <!-- <p>类型：{{ item.type }}&nbsp;</p> -->
      <button v-if="item.type == 'directory'" @click="push_path(item.basename)">></button>
      <button v-else-if="item.type == 'file' && getFileType(item.filename) == 'zip'" @click="readComic(index, item.basename)">阅读漫画</button>
      <button v-else-if="item.type == 'file' && getFileType(item.filename) == 'epub'" @click="readEpub(index, item.basename)">阅读漫画</button>

      <!-- <button  >阅读小说</button> -->
      <el-dropdown v-else-if="item.type == 'file' && getFileType(item.filename) == 'txt'">
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="readNovel(item.basename, index)">阅读</el-dropdown-item>
            <el-dropdown-item @click="deleNovel(item.basename)">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
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

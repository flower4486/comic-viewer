<template src="./index.html"></template>
<style scoped src="./index.css"></style>
<script setup>
import { listDirectory, getFileText, getFileContent } from '@/api/dav';
import { onMounted } from 'vue';
import { usePathStore } from '@/store/pathStore';
import { useNovelStore } from '@/store/novelStore';
import { getFileType } from '@/utils/utils';
import { getNovelId, uploadNovel, getChapterList, deleNovelPost } from '@/api/novel';
import { ArrowDown } from '@element-plus/icons-vue';
import { addLikesPost } from '@/api/novel';
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
  let listDir = await listDirectory(folder_path);
  directoryItems = listDir.sort(compareLabels);
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
  // console.log('basename', basename);
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
      // console.error(error);
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
//添加收藏
async function addLike(basename, filename) {
  await addLikesPost(basename, filename);
}
</script>

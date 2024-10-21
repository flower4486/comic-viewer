<template src="./index.html"></template>
<style scoped lang="scss" src="./index.css"></style>
<script setup>
import { getFileContent } from '@/api/dav';
import { addRecordPost, selctRecordPost } from '@/api/novel';
import { extractAndDisplayImages_sync, compareLabels } from '@/api/extract';
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { usePathStore } from '@/store/pathStore';

const pathStore = usePathStore();
const router = useRouter();
let containerStyle = $ref('scrollbar-container-col');
let show_imgs = $ref([]);
let zipFile = $ref(null);
let divread = ref();
// //获取压缩包并解压
// let davpromise = getFileContent(route.params.path);
onMounted(() => {
  updateList(pathStore.index);
});
function change_read_mode() {
  if (containerStyle == 'scrollbar-container-col') {
    containerStyle = 'scrollbar-container-row';
  } else {
    containerStyle = 'scrollbar-container-col';
  }
}

function updateList(index) {
  let file_path = pathStore.path + '/' + pathStore.comicFiles[index].basename;

  let davpromise = getFileContent(file_path);
  davpromise.then((res) => {
    zipFile = res;
    extractAndDisplayImages_sync(zipFile).then((imgs) => {
      show_imgs = imgs.value;
    });
  });
  divread.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function orderImg() {
  show_imgs.sort(compareLabels);
}
function router_back() {
  //每次变换章节的时候都要记录一下章节数
  addRecordPost(pathStore.path, pathStore.index, 0);
  divread.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  router.push({ name: 'Folder', params: { path: pathStore.path } });
}
function next_chapter() {
  pathStore.index++;
  //每次变换章节的时候都要记录一下章节数
  addRecordPost(pathStore.path, pathStore.index, 0);
  updateList(pathStore.index);
}
function last_chapter() {
  pathStore.index--;
  //每次变换章节的时候都要记录一下章节数
  addRecordPost(pathStore.path, pathStore.index, 0);
  updateList(pathStore.index);
}

function lasttime_read() {
  selctRecordPost(pathStore.path).then((res) => {
    let last_index = res[0].chapterNum;
    pathStore.index = last_index;
    updateList(pathStore.index);
  });
}
watch(
  () => show_imgs,
  (value, oldValue) => {
    orderImg();
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

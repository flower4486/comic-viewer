<template src="./index.html"></template>
<style lang="scss" scoped src="./index.scss"></style>

<script setup>
import { useRouter } from 'vue-router';
import { usePathStore } from '@/store/pathStore';
import { useNovelStore } from '@/store/novelStore';
import { getChapterContent, addRecordPost, selctRecordPost } from '@/api/novel';
import { ref, onMounted } from 'vue';
import catlog from './components/catlog.vue';
import { chunkArray } from '@/utils/utils';

const dvtop = ref();
const router = useRouter();
const pathStore = usePathStore();
const novelStore = useNovelStore();
let content_dics = $ref([]);
let page_index = $ref(0);
let chapter_name = $ref([]);
let pageConfig = $ref({
  catlogShow: false,
});

function router_back() {
  router.push({ name: 'Folder', params: { path: pathStore.path } });
}
function next_chapter() {
  if (novelStore.chapter_index != novelStore.chapter_dics.length - 1) {
    novelStore.chapter_index++;
    updateChapterContent(1);
  } else {
    window.alert('已经是最后一章');
  }
}
function last_chapter() {
  if (novelStore.chapter_index != 0) {
    novelStore.chapter_index--;
    updateChapterContent(1);
  } else {
    window.alert('已经是第一章');
  }
}

function last_page() {
  if (novelStore.page_index != 0) {
    novelStore.page_index--;
    page_index = novelStore.page_index;
    //更新内容的同时记录阅读位置
    addRecordPost(novelStore.novel_name, novelStore.chapter_index, novelStore.page_index);
    dvtop.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    last_chapter();
  }
  dvtop.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function next_page() {
  if (novelStore.page_index != content_dics.length - 1) {
    novelStore.page_index++;
    page_index = novelStore.page_index;
    //更新内容的同时记录阅读位置
    addRecordPost(novelStore.novel_name, novelStore.chapter_index, novelStore.page_index);
  } else {
    next_chapter();
  }
  dvtop.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 点击目录的章节 子组件传给父组件
function readshows(index) {
  pageConfig.catlogShow = !pageConfig.catlogShow;
  novelStore.chapter_index = index;

  updateChapterContent(1);
}
//    点击显示目录
function showCatlog() {
  pageConfig.catlogShow = !pageConfig.catlogShow;
}

//获取章节内容
async function updateChapterContent(flag) {
  let chapter_id = novelStore.chapter_dics[novelStore.chapter_index].cid;
  chapter_name = novelStore.chapter_dics[novelStore.chapter_index].cname;

  let contents = await getChapterContent(chapter_id);
  content_dics = chunkArray(contents[0].content.split('\n'), 15);

  //每次切换章节将page——index归零,初始化章节则不置为0
  if (flag == 1) novelStore.page_index = 0;
  page_index = novelStore.page_index;

  //更新内容的同时记录阅读位置
  addRecordPost(novelStore.novel_name, novelStore.chapter_index, novelStore.page_index);

  dvtop.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

//挂载后执行页面初始化操作
onMounted(() => {
  selctRecordPost(novelStore.novel_name).then(async (res) => {
    //从数据库中读取上次的阅读记录并恢复
    let store_index = res[0];
    if (store_index != null) {
      novelStore.chapter_index = store_index.chapterNum;
      novelStore.page_index = store_index.pageNum;
    } else {
      novelStore.page_index = 0;
    }
    updateChapterContent(0);
  });
});
</script>

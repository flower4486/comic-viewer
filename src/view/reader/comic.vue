<template>
  <button @click="lasttime_read">上次阅读</button>
  <div ref="divread" class="comic-div">
    <el-scrollbar>
      <div v-for="item in show_imgs" :key="item.index" class="scrollbar-demo-item">
        <img :src="item.img" />
      </div>
    </el-scrollbar>

    <div class="readbottom">
      <el-button type="primary" @click="router_back">返回</el-button>
      <el-button type="primary" @click="last_chapter">上一章</el-button>
      <el-button type="primary" @click="next_chapter">下一章</el-button>
    </div>
  </div>
</template>

<script setup>
import { getFileContent } from '@/api/dav';
import { addRecordPost, selctRecordPost } from '@/api/novel';
import { extractAndDisplayImages_sync, compareLabels } from '@/api/extract';
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { usePathStore } from '@/store/pathStore';
const pathStore = usePathStore();
const router = useRouter();

let show_imgs = $ref([]);
let zipFile = $ref(null);
let divread = ref();
// //获取压缩包并解压
// let davpromise = getFileContent(route.params.path);
onMounted(() => {
  updateList(pathStore.index);
});

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

<style scoped lang="scss">
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
}

.scrollbar-demo-item img {
  margin: 0px;
  padding: 0px;
  max-width: 90%;
  height: 100%;
  display: block;
}

.comic-div {
  position: relative;
  margin: 0%;
  padding: 0;
  width: 100%;
}

.readbottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 110;
  opacity: 0.5;
  background-color: #ffffff;
  .mui-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .readbottom-color {
    display: flex;
    justify-content: space-around;
    list-style: none;
    margin-bottom: 20px;
    li {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  .readbottom-dv {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .readbottom-ml {
      color: #fff;
      text-align: center;
      font-size: 14px;
    }
    .read-ss {
      color: #fff;
    }
    .readbottom-font {
      border: 1px solid #fff;
      padding: 5px 20px;
      border-radius: 3px;
      color: #fff;
    }
  }
}
</style>

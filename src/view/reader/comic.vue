<template>
  <button @click="orderImg">更正顺序</button>
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
import { getFileContent } from '@/requests/dav';
import { extractAndDisplayImages_sync, compareLabels } from '@/requests/extract';
import { useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { usePathStore } from '@/store/pathStore';
const pathStore = usePathStore();
const router = useRouter();

let show_imgs = $ref([]);
let zipFile = $ref(null);
let orderFlag = ref(0);
let divread = ref();
// //获取压缩包并解压
// let davpromise = getFileContent(route.params.path);
onMounted(() => {
  console.log(pathStore);

  updateList(pathStore.index);
});

function updateList(index) {
  let file_path = pathStore.path + '/' + pathStore.comicFiles[index].basename;
  // console.log('file_path', file_path);
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
  console.log('show_imgs', show_imgs);
  show_imgs.sort(compareLabels);
}
function router_back() {
  router.push({ name: 'Folder', params: { path: pathStore.path } });
}
function next_chapter() {
  pathStore.index++;
  updateList(pathStore.index);
}
function last_chapter() {
  pathStore.index--;
  updateList(pathStore.index);
}
watch(
  () => show_imgs,
  (value, oldValue) => {
    console.log('排序', orderFlag.value);
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

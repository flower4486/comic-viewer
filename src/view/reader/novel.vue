<template>
  <!-- 目录 -->

  <div class="read" ref="dvtop">
    <el-button type="primary" @click="router_back">返回</el-button>
    <el-button type="primary" @click="last_chapter">上一章</el-button>
    <el-text class="mx-1" type="primary">{{ parseInt(page_index) + 1 }}/{{ content_dics.length }}</el-text>
    <el-button type="primary" @click="next_chapter">下一章</el-button>

    <el-button type="primary" @click="showCatlog">目录</el-button>

    <div style="min-height: 500px; padding-top: 30px; padding-bottom: 40px">
      <h1 class="read-h1">{{ chapter_name }}</h1>
      <div v-for="(page, index) in content_dics" :key="page">
        <div v-for="para in page" :key="para">
          <p v-if="index == page_index" class="read-text" v-html="para"></p>
        </div>
      </div>
    </div>

    <catlog @readshows="readshows" v-show="pageConfig.catlogShow" @closeLayer="showCatlog()" />

    <div class="readbottom">
      <!-- <el-button type="primary" @click="last_chapter">上一章</el-button>
      <el-button type="primary" @click="next_chapter">下一章</el-button> -->
      <el-button type="primary" @click="last_page">上一页</el-button>
      <el-button type="primary" @click="next_page">下一页</el-button>
    </div>
  </div>
</template>

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
}
function next_page() {
  if (novelStore.page_index != content_dics.length - 1) {
    novelStore.page_index++;
    page_index = novelStore.page_index;
    //更新内容的同时记录阅读位置
    addRecordPost(novelStore.novel_name, novelStore.chapter_index, novelStore.page_index);
    dvtop.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    next_chapter();
  }
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

<style lang="scss" scoped>
.read {
  overflow-y: auto;
  z-index: 101;
  position: absolute;
  margin: 0%;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
  line-height: 24px;
  letter-spacing: 2px;
  // overflow: hidden;
  .read-h1 {
    font-size: 20px;
  }
  // .readpage {
  //   columns: calc(100vw - 32px) 1;
  //   column-gap: 16px;
  //   height: 100%;
  //   transition: 0.4s;
  // }
  .readheader {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 35px;
    background-color: #00c98c;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 6px;
    :nth-child(1) {
      font-size: 20px;
      color: #fff;
    }
    .readspan {
      color: #fff;
      font-size: 12px;
    }
  }
  .readheaders {
    position: fixed;
    top: 40px;
    right: 0;
    background-color: #425faf;
    font-size: 14px;
    color: #fff;
    padding: 0px 5px;
    border-radius: 5px 0px 0px 5px;
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
  h1 {
    font-size: 16px;
    color: #222;
  }
  .read-text {
    text-align: left; /* 文本内容左对齐 */
    color: #222;
    text-indent: 2em;
    font-size: 20px;
  }
  .btn {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #c4b395;
    padding-top: 10px;
    justify-content: center;
    button {
      margin: 0 10px;
      font-size: 12px;
      line-height: 1.2;
      height: 28px;
      color: #425faf;
      border-color: #666;
      &.mint-button--default {
        color: #333;
      }
    }
  }
  .read-hy {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #00c98c;
    .mui-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-height: 60%;
      overflow-y: auto;
      .yh-p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .active {
    color: #00c98c;
  }
}
</style>

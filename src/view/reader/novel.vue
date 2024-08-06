<template>
  <!-- 目录 -->

  <div class="read" ref="dvtop">
    <el-button type="primary" @click="router_back">返回</el-button>
    <el-button type="primary" @click="last_chapter">上一章</el-button>
    <el-button type="primary" @click="next_chapter">下一章</el-button>
    <el-button type="primary" @click="showCatlog">目录</el-button>

    <div style="min-height: 500px; padding-top: 30px">
      <h1 class="read-h1">{{ chapter_name }}</h1>
      <div v-for="item in content_dics[0]" :key="item">
        <p class="read-text" v-html="item"></p>
      </div>
    </div>

    <catlog @readshows="readshows" v-show="pageConfig.catlogShow" @closeLayer="showCatlog()" />

    <div class="readbottom">
      <el-button type="primary" @click="router_back">返回</el-button>
      <el-button type="primary" @click="last_chapter">上一章</el-button>
      <el-button type="primary" @click="next_chapter">下一章</el-button>
      <el-button type="primary" @click="showCatlog">目录</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { usePathStore } from '@/store/pathStore';
import { useNovelStore } from '@/store/novelStore';
import { getChapterContent } from '@/api/novel';
import { ref } from 'vue';
import catlog from './components/catlog.vue';

const dvtop = ref(null);
const router = useRouter();
const pathStore = usePathStore();
const novelStore = useNovelStore();
let content_dics = $ref([]);
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
    updateChapterContent();
    dvtop.scrollTop = 0;
  } else {
    window.alert('已经是最后一章');
  }
}
function last_chapter() {
  if (novelStore.chapter_index != 0) {
    novelStore.chapter_index--;
    updateChapterContent();
    dvtop.scrollTop = 0;
  } else {
    window.alert('已经是第一章');
  }
}

// 点击目录的章节 子组件传给父组件
function readshows(index) {
  pageConfig.catlogShow = !pageConfig.catlogShow;
  novelStore.chapter_index = index;
  updateChapterContent();
  dvtop.scrollTop = 0;
}
//    点击显示目录
function showCatlog() {
  pageConfig.catlogShow = !pageConfig.catlogShow;
}

//获取章节内容
async function updateChapterContent() {
  // console.log(novelStore.chapter_dics);
  let chapter_id = novelStore.chapter_dics[novelStore.chapter_index].cid;
  chapter_name = novelStore.chapter_dics[novelStore.chapter_index].cname;
  let contentres = await getChapterContent(chapter_id);
  let chapter_text = contentres[0].content;
  content_dics = [chapter_text.split('\n')];
  console.log('content_dics', content_dics);
}

updateChapterContent();
</script>

<style lang="scss" scoped>
.read {
  overflow-y: auto;
  z-index: 101;
  position: relative;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #c4b395;
  padding: 20px;
  line-height: 24px;
  letter-spacing: 2px;
  .read-h1 {
    font-size: 20px;
  }
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

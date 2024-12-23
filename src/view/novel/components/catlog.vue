<template>
  <div class="mulu">
    <el-header fixed :title="novelStore.novel_name">
      <div @click="getback">
        <el-button icon="back">返回</el-button>
      </div>
    </el-header>

    <div class="paixu-p">
      <div class="example-pagination-block">
        <span>共{{ chapter_list.length }}章</span>
      </div>
      <!-- <div class="example-pagination-block">
        <div class="example-demonstration">When you have more than 7 pages</div>
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div> -->
    </div>

    <!-- <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
    </ul>.slice((currentPage - 1) * pagesize, currentPage * pagesize) -->
    <!-- <el-table :data="tableData()" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="cname" label="章节名" width="1000"  />
    </el-table> -->
    <ul>
      <li v-for="(item, index) in tableData()" :key="item" @click="getIndex(50 * state.page - 50 + index)">
        {{ item.cname }}
      </li>
    </ul>
    <div class="example-pagination-block">
      <el-pagination background layout="prev, pager, next ,total,jumper" :current-page="state.page" :page-size="state.pageSize" :total="state.total" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { useNovelStore } from '@/store/novelStore';
import { defineEmits, onMounted } from 'vue';
import { chapterSort } from '@/utils/utils';
let novelStore = useNovelStore();
let chapter_list = $ref([]);
const emit = defineEmits(['readshows', 'closeLayer']);
function getIndex(index) {
  emit('readshows', index); //将点击的章节传给父组件 read.vue
}
function getback() {
  emit('closeLayer');
}

//表格用到的参数
const state = reactive({
  page: 1,
  limit: 50,
  total: 0,
  pageSize: 50,
});
//前端限制分页（tableData为当前展示页表格）
const tableData = () => {
  return chapter_list.filter((item, index) => index < state.page * state.limit && index >= state.limit * (state.page - 1));
};
//改变页码
const handleCurrentChange = (e) => {
  state.page = e;
};

onMounted(() => {
  //对章节列表进行排序
  chapter_list = novelStore.chapter_dics;
  // console.log("chapter_list",chapter_list);

  chapter_list.sort(chapterSort);

  state.total = chapter_list.length;
  state.page = ((novelStore.chapter_index / 50) | 0) + 1;
});
</script>

<style lang="scss" scoped>
.mulu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  z-index: 9999;
  background-color: #fff;
  ul {
    padding-top: 55px;
  }
  li {
    font-size: 13px;
    padding-left: 20px;
    line-height: 36px;
    border-bottom: 1px solid #eee;
    color: #333;
  }
  .paixu-p {
    position: fixed;
    top: 30px;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 110;
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;
    color: #6b2662;
    font-size: 12px;
  }
}
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block {
  margin-bottom: 16px;
}
</style>

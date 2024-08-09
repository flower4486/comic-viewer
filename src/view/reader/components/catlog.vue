<template>
  <div class="mulu">
    <el-header fixed :title="novelStore.novel_name">
      <div @click="getback">
        <el-button icon="back">返回</el-button>
      </div>
      <!-- <el-button>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shudan"></use>
        </svg>
      </el-button> -->
    </el-header>

    <div class="paixu-p">
      <span>共{{ chapter_list.length }}章</span>
    </div>

    <ul>
      <li v-for="(item, index) in chapter_list" :key="item" @click="getIndex(index)">
        {{ item.cname }}
      </li>
    </ul>
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

onMounted(() => {
  //对章节列表进行排序
  chapter_list = novelStore.chapter_dics;
  console.log("chapter_list",chapter_list);

  chapter_list.sort(chapterSort);
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
</style>

import { defineStore } from 'pinia';

export const useNovelStore = defineStore('novel', () => {
  //小说名字，章节信息列表，index，章节阅读
  let novel_name = '';
  let chapter_index = 0;
  let chapter_dics = [];
  return {
    novel_name,
    chapter_dics,
    chapter_index,
  };
});

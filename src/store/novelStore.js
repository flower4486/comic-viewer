import { defineStore } from 'pinia';

export const useNovelStore = defineStore({
  id: 'novel',
  //小说名字，章节信息列表，index，章节阅读
  state: () => {
    return {
      novel_name: '',
      chapter_dics: [],
      chapter_index: 0,
      page_index: 0,
    };
  },
  actions: {
    get_page_index() {
      return this.page_index;
    },
  },
  persist: {
    enabled: true, // 这个配置代表存储生效，而且是整个store都存储
  },
});

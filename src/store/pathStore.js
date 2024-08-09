import { defineStore } from 'pinia';
export const usePathStore = defineStore({
  id: 'path',
  state: () => {
    return {
      path: '/',
      comicFiles: [],
      index: 0,
    };
  },
  persist: {
    enabled: true, // 这个配置代表存储生效，而且是整个store都存储
  },
});

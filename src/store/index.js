import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const usePathStore = defineStore('path', () => {
  let path = $ref('/');
  let comicFiles = reactive([]);
  let index = $ref(0);

  return {
    path,
    comicFiles,
    index,
  };
});

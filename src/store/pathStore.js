import { defineStore } from 'pinia';

export const usePathStore = defineStore('path', () => {
  let path = $ref('/');
  let comicFiles = $ref([]);
  let index = $ref(0);

  return {
    path,
    comicFiles,
    index,
  };
});

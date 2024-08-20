<template>
  <div class="read">
    <vue-reader :url="epubBuffer" :getRendition="getRendition" />
  </div>
</template>

<script setup>
import { VueReader } from 'vue-reader';
import { usePathStore } from '@/store/pathStore';
import { getFileContent } from '@/requests/dav';
import { onMounted } from 'vue';

let pathStore = usePathStore();
let epubBuffer = $ref([]);

onMounted(async () => {
  console.log(pathStore.index);
  epubBuffer = await getFileContent(pathStore.comicFiles[pathStore.index].filename);
  console.log('epubBuffer', epubBuffer);
});
</script>

<style lang="scss" scoped>
.read {
  overflow-y: auto;
  z-index: 101;
  position: fixed;
  margin: 0%;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: #c4b395;
  padding: 20px;
  line-height: 24px;
  letter-spacing: 2px;
}
</style>

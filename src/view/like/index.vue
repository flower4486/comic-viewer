<template src="./index.html"></template>
<style src="./index.css" scoped></style>

<script setup>
import { onMounted, watch, ref } from 'vue';
import { selctLikesPost, deleLikePost } from '@/api/novel';
import { useRouter } from 'vue-router';
import { usePathStore } from '@/store/pathStore';
const router = useRouter();
const pathStore = usePathStore();
let history_items = ref([
  { lname: '你好', path: '/n/c' },
  { lname: '你不好', path: '/n/c' },
]);
function comparable(a, b) {
  return b.time - a.time;
}
onMounted(() => {
  selctLikesPost().then((res) => {
    history_items.value = res;
    // console.log(history_items.value);
  });
});
watch(
  () => history_items,
  (value, oldValue) => {
    history_items.value.sort(comparable);
    // console.log(history_items.value);
  },
  {
    deep: true,
    immediate: true,
  },
);
async function readNovel(path) {
  console.log('path', path);
  pathStore.path = path;
  router.push({ name: 'Folder', params: { path: pathStore.path } });
}
async function deleNovel(lname) {
  await deleLikePost(lname);
}
</script>

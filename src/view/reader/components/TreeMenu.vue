<template>
  <ul>
    <li v-for="title in subContent" :key="title.id">
      <a @click="showPage(title.href)">{{ title.label }}</a>
      <template v-if="title.subitems">
        <TreeMenu :subContent="title.subitems"></TreeMenu>
      </template>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  subContent: Array,
});

const emit = defineEmits(['showPage']);

// showPage(cfi) {
//   this.$root.$emit('showPage', cfi);
// },
function showPage(cfi) {
  emit('showPage', cfi);
}
</script>
<style lang="scss" scoped></style>

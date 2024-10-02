<template>
  <div>
    <slot name="book-content" :showContent="showContent">
      <button class="my-find my-content" @click="showContent">
        <img src="#" alt="" />
      </button>
      <div class="search-widget" v-if="menuConfigs.openContentWidget">
        <TreeMenu :subContent="menuConfigs.toc" />
      </div>
    </slot>
    <slot name="book-search" :toggleSearchWidget="toggleSearchWidget" :findText="findText" :removeHighlight="removeHighlight" :showPage="showPage">
      <button class="my-find" @click="toggleSearchWidget">
        <img src="#" alt="" />
      </button>
      <div class="search-widget" v-if="openSearchWidget">
        <input type="text" :value="value" @change="findText($event.target.value)" />
        <button @click="removeHighlight">x</button>
        <ul>
          <li v-for="(excerpt, i) in searchResults" :key="i" @click="showPage(excerpt.cfi)">
            <p>{{ excerpt.excerpt }}</p>
          </li>
        </ul>
      </div>
    </slot>
    <slot name="book-appearance" :toggleDropdown="toggleDropdown" :fontSizeDecrease="fontSizeDecrease" :fontSizeIncrease="fontSizeIncrease" :selectTheme="selectTheme">
      <button class="buton" @click="toggleDropdown">Aa</button>
      <div class="hover" v-if="menuConfigs.opened">
        <p class="text">TEXT</p>
        <div id="gray-line">
          <button class="text-size" id="little-letter" @click="fontSizeDecrease">A-</button>
          <button class="text-size" id="big-letter" @click="fontSizeIncrease">A+</button>
        </div>
        <p class="text">BACKGROUND</p>
        <button class="button-background" :class="{ current: key === currentTheme }" :style="theme.body" v-for="(theme, key) in themes" id="key" :key="key" @click="selectTheme(key)">
          {{ theme.name }}
        </button>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { watch, defineEmits, onMounted, reactive } from 'vue';
import TreeMenu from './TreeMenu.vue';
const emit = defineEmits(['update:font-size', 'update:currentTheme', 'input']);
const props = defineProps({
  themes: {
    type: Object,
    required: true,
  },
  currentTheme: {
    type: String,
    required: true,
  },
  fontSize: {
    type: Number,
  },
  value: {
    type: String,
    required: true,
  },
});

let menuConfigs = reactive({
  opened: false,
  openSearchWidget: false,
  openContentWidget: false,
  searchText: '',
  matches: [],
  searchResults: [],
  toc: null,
});

var fontSize = ref(80);
const step = 10;

function toggleDropdown() {
  menuConfigs.opened = !menuConfigs.opened;
}

function selectTheme(key) {
  emit('update:currentTheme', key);
}

function fontSizeIncrease() {
  updateFontSize(fontSize + step);
}

function fontSizeDecrease() {
  updateFontSize(fontSize - step);
}
function updateFontSize(newVal) {
  if (fontSize <= 50 || fontSize >= 200) {
    return;
  }
  fontSize = newVal;
  emit('update:font-size', fontSize);
}

function toggleSearchWidget() {
  menuConfigs.openSearchWidget = !menuConfigs.openSearchWidget;
}

function showContent() {
  menuConfigs.openContentWidget = !menuConfigs.openContentWidget;
  this.$root.$emit('showContent');
}

function findText(value) {
  // emit('input', value);
  // fetch('http://localhost:8085/search?q=' + value + '&uuid=01bf2ad2-b8f5-43cf-9089-1a1d0299bf83')
  //   .then((res) => res.json())
  //   .then((matches) => {
  //     menuConfigs.matches = matches;
  //     menuConfigs.matches
  //       .map((item) => {
  //         return item.cfis;
  //       })
  //       .map((item) => {
  //         return item;
  //       })
  //       .map((e) => {
  //         menuConfigs.searchResults.push(...e);
  //       });
  //     emit('searchResults', menuConfigs.searchResults);
  //   });
}

function showPage(cfi) {
  // this.$root.$emit('showPage', cfi);
}

function removeHighlight() {
  // this.$root.$emit('clearHighlight');
}

onMounted(() => {
  // this.$root.$on('toc', (toc) => {
  //   menuConfigs.toc = toc;
  // });
  fontSize = props.fontSize;
});
</script>

<style lang="scss" scoped>
.my-find {
  background-color: white;
  border: none;
  color: white;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin-left: 68px;
  border-radius: 50%;
}

.my-content {
  margin-left: 78px;
}

.my-content > img {
  width: 18px;
}

.search-widget {
  overflow: auto;
  position: fixed;
  padding: 20px;
  border: 5px solid #f1f1f1;
  background: #fff;
  border-radius: 5px;
  font-family: 'Roboto', sans-serif;
  width: 16%;
  height: 81%;
  z-index: 100;
}
.search-widget h3 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  font-weight: normal;
  color: #424949;
}
.search-widget ul {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 250px;
}
.search-widget li {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.search-widget li:before {
  font-family: FontAwesome;
  font-size: 20px;
  vertical-align: bottom;
  color: #dd3333;
  margin-right: 14px;
}
</style>
>

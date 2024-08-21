<template>
  <PreferencesDropdown
    v-model:themes="epub_configs.themes"
    v-model:current-theme="epub_configs.currentTheme"
    v-model:font-size="epub_configs.size"
    v-model="epub_configs.serchQuery"
    @searchResults="epub_configs.onSearchResults">
    <template #book-content>
      <button class="my-find my-content" @click="showContent">
        <img src="@/static/left-alignment.svg" alt="" />
      </button>
      <div class="search-widget1" v-if="epub_configs.openContent">
        <TreeMenu :subContent="epub_configs.toc" @showPage="showPage" />
      </div>
    </template>
    <template #book-search>
      <button class="my-find" @click="toggleSearchWidget">
        <img src="@/static/search.svg" alt="" />
      </button>
      <div class="search-widget1" v-if="epub_configs.openSearch">
        <input type="text" :value="serchQuery" @change="props.findText($event.target.value)" />
        <button @click="props.removeHighlight">x</button>
        <ul>
          <li v-for="(excerpt, i) in epub_configs.searchContent" :key="i" @click="showPage(excerpt.cfi)">
            <p>{{ excerpt.excerpt }}</p>
          </li>
        </ul>
      </div>
    </template>
  </PreferencesDropdown>
  <div class="read" id="reader" v-show="true">
    <!-- <vue-reader :url="epubBuffer" :getRendition="getRendition" /> -->
  </div>

  <div class="readbottom">
    <el-button type="primary" @click="router_back">返回</el-button>
    <el-button type="primary" @click="prev_page">上一页</el-button>
    <el-button type="primary" @click="next_page">下一页</el-button>
    <el-button type="primary" @click="test">功能测试</el-button>
  </div>
</template>

<script setup>
import { VueReader } from 'vue-reader';
import Epub from 'epubjs';
import { usePathStore } from '@/store/pathStore';
import { getFileContent } from '@/requests/dav';
import { onMounted } from 'vue';
import TreeMenu from './components/TreeMenu.vue';
import PreferencesDropdown from './components/PreferencesDropdown.vue';
let pathStore = usePathStore();
let epubBuffer = $ref([]);
let rendition = null;
const eventBus = ref({});

const flow_props = ['auto', 'scrolled-doc'];
let props_select = {
  flow_index: 0,
};

let epub_configs = $ref({
  book: null,
  rendition: null,
  section: null,
  toc: [],
  progressValue: 0,
  slide: null,
  cfi: null,
  width: 0,
  height: 0,
  locations: null,
  ready: false,
  url: './static/alice.epub',
  size: 80,
  currentTheme: 'beige',
  themes: {
    white: {
      body: {
        color: '#000000',
        background: '#ffffff',
      },
      name: 'WHITE',
    },
    beige: {
      body: {
        color: '#000000',
        background: '#f3e8d2',
      },
      name: 'BEIGE',
    },
    night: {
      body: {
        color: '#ffffff',
        background: '#4a4a4a',
      },
      name: 'NIGHT',
    },
  },
  serchQuery: '',
  readingProgress: 20,
  openSearch: false,
  openContent: false,
  searchContent: [],
});

onMounted(async () => {
  // console.log(pathStore.index);
  epubBuffer = await getFileContent(pathStore.comicFiles[pathStore.index].filename);
  // console.log('epubBuffer', epubBuffer);

  epub_configs.book = Epub(epubBuffer, {});
  epub_configs.book.loaded.navigation.then(({ toc }) => {
    epub_configs.toc = toc;
    // epub_configs.$emit('toc', epub_configs.toc);
    initReader();
    // epub_configs.rendition.on('click', () => {
    //   this.$emit('click');
    // });
  });

  epub_configs.book.ready
    .then(() => {
      return epub_configs.book.locations.generate();
    })
    .then(() => {
      epub_configs.locations = JSON.parse(epub_configs.book.locations.save());
      epub_configs.ready = true;
      console.log('epub_configs', epub_configs);
    });
  // console.log('book', book.navigation);
  // rendition = book.renderTo('reader', {
  //   width: '100%',
  //   height: '100%',
  //   allowScriptedContent: true,
  //   // flow: 'scrolled-doc',
  //   // manager: 'continuous',
  // });
  // rendition.display();
  // console.log('rendition', rendition);
  // book.loaded.navigation.then((tpc) => {
  //   console.log('navigation', tpc);
  // });

  window.addEventListener('keyup', keyListener);
  window.addEventListener(
    'resize',
    debounce(() => {
      resizeToScreenSize();
    }, 250),
  );
});
function updateScreenSizeInfo() {
  epub_configs.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  epub_configs.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function resizeToScreenSize() {
  updateScreenSizeInfo();
  epub_configs.rendition.resize(epub_configs.width, epub_configs.height);
}

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    let context = this;
    let args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
function keyListener(e) {
  if ((e.keyCode || e.which) === 37) {
    epub_configs.rendition.prev();
  }
  if ((e.keyCode || e.which) === 39) {
    epub_configs.rendition.next();
  }
}
function goToExcerpt(cfi) {
  if (cfi.toLowerCase().indexOf('xhtml') > 0) {
    epub_configs.rendition.display(cfi);
  } else {
    epub_configs.rendition.display('epubcfi(' + cfi + ')');
    epub_configs.rendition.annotations.highlight('epubcfi(' + cfi + ')');
  }
}
onBeforeUnmount(() => {
  window.removeEventListener('keyup', keyListener);
});
function initReader() {
  epub_configs.rendition = epub_configs.book.renderTo('reader', {
    contained: true,
    height: epub_configs.height,
  });
  // this.registerThemes();
  // this.setTheme(this.theme);
  // this.setFontSize(this.fontSize);
  epub_configs.rendition.display();
}
function next_page() {
  epub_configs.rendition.next();
}
function prev_page() {
  epub_configs.rendition.prev();
}

async function test() {
  epub_configs.rendition.flow(flow_props[props_select.flow_index]);
  props_select.flow_index = (props_select.flow_index + 1) % 2;
}

function toggleSearchWidget() {
  epub_configs.openSearch = !epub_configs.openSearch;
}

function showContent() {
  epub_configs.openContent = !epub_configs.openContent;
}
function showPage(cfi) {
  epub_configs.cfi = cfi;
  goToExcerpt(cfi);
}
function onSearchResults(value) {
  epub_configs.searchContent = value;
}

function getContent(value) {
  epub_configs.toc = value;
}
</script>

<style lang="scss" scoped>
.read {
  overflow-y: auto;
  z-index: 101;
  position: relative;
  top: 0;
  left: 0%;
  bottom: 10%;
  width: 100%;
  height: 100%;
  background-color: #c4b395;
  padding: 20px;
}

.readbottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 110;
  opacity: 0.5;
  background-color: #ffffff;
  .mui-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .readbottom-color {
    display: flex;
    justify-content: space-around;
    list-style: none;
    margin-bottom: 20px;
    li {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  .readbottom-dv {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .readbottom-ml {
      color: #fff;
      text-align: center;
      font-size: 14px;
    }
    .read-ss {
      color: #fff;
    }
    .readbottom-font {
      border: 1px solid #fff;
      padding: 5px 20px;
      border-radius: 3px;
      color: #fff;
    }
  }
}
</style>

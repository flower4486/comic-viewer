import { createRouter, createWebHistory } from 'vue-router';

// 本地静态路由
export const constantRoutes = [
  {
    path: '/folder/:path',
    name: 'Folder',
    component: () => import('@/view/folder/index.vue'),
    meta: {
      isParentView: true,
      keepAlive: true,
    },
  },
  {
    path: '/like',
    name: 'Like',
    component: () => import('@/view/like/index.vue'),
    meta: {
      isParentView: true,
      keepAlive: true,
    },
  },
  {
    path: '/comic',
    name: 'Comic',
    component: () => import('@/view/comic/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/epub',
    name: 'Epub',
    component: () => import('@/view/reader/epub.vue'),
  },
  {
    path: '/novel/:nid',
    name: 'Novel',
    component: () => import('@/view/novel/index.vue'),
    meta: {
      keepAlive: true,
    },
  },
  // {
  //   // path: '/404',
  //   path: '/:pathMatch(.*)*', // 防止浏览器刷新时路由未找到警告提示: vue-router.mjs:35 [Vue Router warn]: No match found for location with path "/xxx"
  //   component: () => import('@/views/error-page/404.vue'),
  // },
];

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export default router;

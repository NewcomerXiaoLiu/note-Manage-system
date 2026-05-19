/*
 * @FilePath: /vue3-template-project/src/router/routes/staticRoutes.TS
 * @Description: 静态路由配置
 */
import type { AppRouteRecordRaw } from 'vue-router';

export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/components/core/layout/index.vue'),
    redirect: '/home',
    children: []
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/result/403.vue')
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/result/500.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/result/404.vue')
  }
];

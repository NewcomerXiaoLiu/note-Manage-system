import type { AppRouteRecordRaw } from 'vue-router';

export const homeRoutes: AppRouteRecordRaw = {
  name: 'home',
  path: '/home',
  component: '/home/index',
  meta: {
    icon: 'ic:outline-home',
    title: '首页'
  }
};

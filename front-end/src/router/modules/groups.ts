import type { AppRouteRecordRaw } from 'vue-router';

export const groupsRoutes: AppRouteRecordRaw = {
  name: 'groups',
  path: '/groups',
  component: '/groups/index',
  meta: {
    icon: 'ant-design:folder-outlined',
    title: '笔记分组'
  }
};

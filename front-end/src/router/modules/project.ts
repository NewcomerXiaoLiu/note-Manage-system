import type { AppRouteRecordRaw } from 'vue-router';

export const projectRoutes: AppRouteRecordRaw = {
  name: 'projectManage',
  path: '/projectManage',
  component: '/projectManage/index',
  meta: {
    icon: 'ix:project',
    title: '项目管理'
  }
};

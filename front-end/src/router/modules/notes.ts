import type { AppRouteRecordRaw } from 'vue-router';

export const notesRoutes: AppRouteRecordRaw = {
  name: 'notes',
  path: '/notes',
  component: '/notes/index',
  meta: {
    icon: 'ant-design:file-text-outlined',
    title: '笔记列表'
  }
};

export const noteEditRoute: AppRouteRecordRaw = {
  name: 'noteEdit',
  path: '/notes/edit/:id?',
  component: '/notes/edit',
  meta: {
    title: '编辑笔记',
    isHide: true
  }
};

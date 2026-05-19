/*
 * @FilePath: /vue3-template-project/src/router/index.ts
 * @Description: 本地路由
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { setupAfterEachGuard } from './guards/afterEach';
import { setupBeforeEachGuard } from './guards/beforeEach';
import { staticRoutes } from './routes/staticRoutes';
import type { App } from 'vue';

// 创建路由实例
export const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes: staticRoutes as RouteRecordRaw[] // 静态路由
});

// 初始化路由
export function initRouter(app: App<Element>): void {
  setupBeforeEachGuard(router); // 路由前置守卫
  setupAfterEachGuard(router); // 路由后置守卫
  app.use(router);
}

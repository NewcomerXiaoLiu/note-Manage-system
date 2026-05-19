/*
 * @FilePath: /vue3-template-project/src/main.ts
 * @Description: main.ts 入口文件
 */

import { createApp } from 'vue';
import App from './App.vue';
import { setupGlobDirectives } from '@/directives'; // 全局指令
import { initRouter } from '@/router'; // Router
import { initStore } from '@/store'; // Store
import { initUpdateChecker } from '@/utils/version/checkUpdate'; // 版本更新检查
import '@/assets/styles/tailwind.css'; // Tailwind CSS
import 'ant-design-vue/dist/reset.css'; // 重置样式
import '@/assets/styles/index.scss'; // 全局样式

const app = createApp(App);
// 初始化路由和状态管理
initStore(app);
// 初始化路由
initRouter(app);
// 注册全局指令
setupGlobDirectives(app);
// 挂载到 DOM
app.mount('#app');
// 初始化更新检查（仅在生产环境）
if (import.meta.env.PROD) {
  initUpdateChecker();
}

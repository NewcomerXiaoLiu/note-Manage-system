import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import type { App } from 'vue';

export const store = createPinia();

// 配置持久化插件
store.use(createPersistedState());

/**
 * 初始化 Store
 */
export function initStore(app: App<Element>): void {
  app.use(store);
}

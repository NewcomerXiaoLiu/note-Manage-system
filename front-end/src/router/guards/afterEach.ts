/*
 * @FilePath: /vue3-template-project/src/router/guards/afterEach.ts
 * @Description: 路由后置守卫
 */
import { nextTick } from 'vue';
import { Router } from 'vue-router';
import { getPendingLoading, resetPendingLoading } from './beforeEach'; // 引入 pendingLoading 相关方法
import { useSettingStore } from '@/store/modules/setting'; // 引入设置状态管理模块
import { loadingService } from '@/utils/fullLoading'; // 引入加载动画相关方法
import { close, remove } from '@/utils/nprogress'; // 引入 nprogress 相关方法

/**
 * @description: 设置路由全局后置守卫
 * @param {Router} router 路由实例
 * @return {void} 无返回值
 */
export function setupAfterEachGuard(router: Router) {
  router.afterEach(() => {
    // 关闭进度条
    const settingStore = useSettingStore();
    if (settingStore.showNprogress) {
      close();
      // 确保进度条完全移除，避免残影
      setTimeout(() => {
        remove();
      }, 600);
    }

    // 关闭 loading 效果
    if (getPendingLoading()) {
      nextTick(() => {
        loadingService.hideLoading();
        resetPendingLoading();
      });
    }
  });
}

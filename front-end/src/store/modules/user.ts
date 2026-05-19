import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
// import { UserState } from '../interface';
import piniaPersistConfig from '../piniaPersist';
import { authApi } from '@/api/modules/auth';
import { router } from '@/router';
import { resetRouterState } from '@/router/guards/beforeEach';

export const useUserStore = defineStore(
  'userStore',
  () => {
    // 登录状态
    const isLogin = ref(false);
    // 用户信息
    const info = ref<any>({});

    // 计算属性：获取用户信息
    const getUserInfo = computed(() => info.value);

    /**
     * 设置用户信息
     * @param newInfo 新的用户信息
     */
    const setUserInfo = (newInfo: any) => {
      info.value = newInfo;
    };

    /**
     * 设置登录状态
     * @param status 登录状态
     */
    const setLoginStatus = (status: boolean) => {
      isLogin.value = status;
    };

    /**
     * 退出登录
     * 清空所有用户相关状态并跳转到登录页
     * 如果是同一账号重新登录，保留工作台标签页
     */
    const logOut = async () => {
      // 保存当前用户 ID，用于下次登录时判断是否为同一用户
      // const currentUserId = info.value.userId;
      // if (currentUserId) {
      //   localStorage.setItem(StorageConfig.LAST_USER_ID_KEY, String(currentUserId));
      // }

      // 清空用户信息
      info.value = {};
      // 重置登录状态
      isLogin.value = false;
      await authApi.logout();
      // 重置路由状态
      resetRouterState(500);
      // 移除iframe路由缓存
      // sessionStorage.removeItem('iframeRoutes');
      // 清空主页路径
      // useMenuStore().setHomePath('');
      // 跳转到登录页，携带当前路由作为 redirect 参数
      // const currentRoute = router.currentRoute.value;
      // const redirect = currentRoute.path !== '/login' ? currentRoute.fullPath : undefined;
      router.replace('/login');
    };

    return {
      isLogin,
      info,
      getUserInfo,
      setUserInfo,
      setLoginStatus,
      logOut
    };
  },
  {
    persist: piniaPersistConfig('userStore')
  }
);

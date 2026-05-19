/*
 * @FilePath: /vue3-template-project/src/router/guards/beforeEach.ts
 * @Description: 路由前置守卫，用于处理路由跳转前的逻辑
 */
import { message } from 'ant-design-vue';
import { nextTick } from 'vue';
import { staticRoutes } from '../routes/staticRoutes'; // 引入静态路由配置
import { RoutesAlias } from '../routesAlias'; // 引入路由别名常量
import type { AppRouteRecordRaw, NavigationGuardNext, RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'; // 引入路由相关类型定义
import { HOME_URL } from '@/config'; // 引入首页路径常量
import { router } from '@/router/index'; // 引入路由实例
import { useMenuStore } from '@/store/modules/menu'; // 引入菜单状态管理模块
import { useSettingStore } from '@/store/modules/setting'; // 引入设置状态管理模块
import { useUserStore } from '@/store/modules/user'; // 引入用户状态管理模块
import { loadingService } from '@/utils/fullLoading'; // 引入加载动画相关方法
import { start } from '@/utils/nprogress'; // 引入 nprogress 相关方法
import { validateMenuList, validatePath } from '@/utils/router'; // 引入路由验证相关方法
import { checkUpdate, showUpdateNotification } from '@/utils/version/checkUpdate'; // 版本更新检查

// 使用变量记录动态路由加载状态
let pendingLoading = false; // 跟踪是否需要关闭 loading
let routerRegistered = false; // 路由是否注册
let routeInitInProgress = false; // 路由初始化进行中标记，防止并发请求
let removeRouteFns: Array<() => void> = []; // 存储移除路由的函数列表
// 路由初始化失败标记，防止死循环
// 一旦设置为 true，只有刷新页面或重新登录才能重置
let routeInitFailed = false;

/**
 * @description: 获取 pendingLoading 状态
 * @return {boolean} pendingLoading 状态值
 */
export function getPendingLoading(): boolean {
  return pendingLoading;
}

/**
 * @description: 重置 pendingLoading 状态，通常在路由初始化完成后调用
 * @return {void} 无返回值
 */
export function resetPendingLoading(): void {
  pendingLoading = false;
}

/**
 * @description: 重置路由状态，包括移除所有动态路由、重置路由注册标记等
 * @param {number} delay 延迟时间，单位为毫秒
 * @return {void} 无返回值
 */
export function resetRouterState(delay: number): void {
  setTimeout(() => {
    removeRouteFns.forEach(fn => fn());
    removeRouteFns = [];
    routerRegistered = false;
    routeInitFailed = false;
    routeInitInProgress = false;
  }, delay);
}

/**
 * @description: 设置路由全局前置守卫
 * @param {Router} router 路由实例
 * @return {void} 无返回值
 */
export function setupBeforeEachGuard(router: Router): void {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    try {
      // 异步检查更新，不阻塞路由跳转
      if (import.meta.env.PROD) {
        checkUpdate()
          .then(async updateAvailable => {
            if (updateAvailable) {
              await showUpdateNotification();
            }
          })
          .catch(err => {
            console.error('路由守卫中检查更新失败:', err);
          });
      }
      console.log('[handleRouteGuard] 处理路由守卫逻辑');
      await handleRouteGuard(to, from, next, router);
    } catch (error) {
      console.error('[RouteGuard] 路由守卫处理失败:', error);
      closeLoading();
      next({ name: '500' });
    }
  });
}

/**
 * @description: 处理路由守卫逻辑
 * @param {RouteLocationNormalized} to 目标路由对象
 * @param {RouteLocationNormalized} from 来源路由对象
 * @param {NavigationGuardNext} next 路由导航控制函数
 * @param {Router} router 路由实例
 * @return {Promise<void>} 无返回值的 Promise
 * @remarks: 此函数处理路由守卫逻辑，包括登录状态检查、动态路由注册和根路径重定向等。
 */
async function handleRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
): Promise<void> {
  const settingStore = useSettingStore();
  const userStore = useUserStore();

  console.log(`[RouteGuard] 导航到: ${to.fullPath} 来自: ${from.fullPath}`, to, from);
  // 启动进度条
  if (settingStore.showNprogress) {
    console.log('[RouteGuard] 启动进度条');
    start();
  }

  // 1. 检查登录状态
  if (!handleLoginStatus(to, userStore, next)) {
    console.log('[RouteGuard] 登录状态检查失败，已处理跳转');
    return;
  }

  // 2. 检查路由初始化是否已失败（防止死循环）
  if (routeInitFailed) {
    console.log('[RouteGuard] 路由初始化已失败，直接跳转到错误页面');
    // 已经失败过，直接放行到错误页面，不再重试
    if (to.matched.length > 0) {
      console.log('[RouteGuard] 已匹配到路由，继续导航');
      next();
    } else {
      console.log('[RouteGuard] 未匹配到路由，跳转到 500 页面');
      // 未匹配到路由，跳转到 500 页面
      next({ name: '500', replace: true });
    }
    return;
  }

  // 3. 处理动态路由注册
  if (!routerRegistered && userStore.isLogin) {
    console.log('[RouteGuard] 动态路由未注册，开始注册');
    // 防止并发请求（快速连续导航场景）
    if (routeInitInProgress) {
      console.log('[RouteGuard] 路由初始化进行中，等待完成后重新导航');
      // 正在初始化中，等待完成后重新导航
      next(false);
      return;
    }
    console.log('[RouteGuard] 注册动态路由');
    await handleDynamicRoutes(to, next, router);
    return;
  }

  // 4. 处理根路径重定向
  if (handleRootPathRedirect(to, next)) {
    console.log('[RouteGuard] 处理根路径重定向');
    return;
  }

  // 5. 处理已匹配的路由
  if (to.matched.length > 0) {
    console.log('[RouteGuard] 已匹配到路由，继续导航');
    next();
    return;
  }

  // 6. 未匹配到路由，跳转到 404
  console.log('[RouteGuard] 未匹配到路由，跳转到 404 页面');
  next({ name: '404' });
}

/**
 * @description: 处理登录状态，根据用户是否已登录和访问的路由决定是否放行或跳转到登录页
 * @param {RouteLocationNormalized} to 目标路由对象
 * @param {ReturnType<typeof useUserStore>} userStore 用户状态存储
 * @param {NavigationGuardNext} next 路由导航控制函数
 * @returns {boolean} true 表示可以继续，false 表示已处理跳转
 */
function handleLoginStatus(
  to: RouteLocationNormalized,
  userStore: ReturnType<typeof useUserStore>,
  next: NavigationGuardNext
): boolean {
  // 已登录或访问登录页或静态路由，直接放行
  if (userStore.isLogin || to.path === RoutesAlias.Login || isStaticRoute(to.path)) {
    return true;
  }

  // 未登录且访问需要权限的页面，跳转到登录页并携带 redirect 参数
  userStore.logOut();
  next({ name: 'Login' });
  return false;
}

/**
 * @description: 检查路由是否为静态路由
 * @param {string} path 目标路径
 * @returns {boolean} true 表示是静态路由，false 表示不是静态路由
 */
function isStaticRoute(path: string): boolean {
  const checkRoute = (routes: any[], targetPath: string): boolean => {
    return routes.some(route => {
      // 跳过通配符路由（404页面）
      if (route.path.includes('(.*)') || route.path.includes('*')) {
        console.log(`[RouteGuard] 跳过通配符路由: ${route.path}`);
        return false;
      }

      console.log(`[RouteGuard] 检查路由匹配: ${route.path} vs ${targetPath}`);
      const routePath = route.path;
      const pattern = routePath.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(targetPath)) {
        return true;
      }
      if (route.children && route.children.length > 0) {
        return checkRoute(route.children, targetPath);
      }
      return false;
    });
  };

  const result = checkRoute(staticRoutes, path);
  console.log(`[RouteGuard] 检查是否为静态路由: ${path} => ${result}`);
  return result;
}

/**
 * @description: 处理动态路由注册逻辑
 * @param {RouteLocationNormalized} to 目标路由对象
 * @param {NavigationGuardNext} next 路由导航控制函数
 * @param {Router} router 路由实例
 * @return {Promise<void>} 无返回值的 Promise
 * @remarks: 此函数获取菜单数据，验证其有效性，注册动态路由，并根据权限重新导航到目标路由。
 */
async function handleDynamicRoutes(to: RouteLocationNormalized, next: NavigationGuardNext, router: Router): Promise<void> {
  const menuStore = useMenuStore();

  // 标记初始化进行中
  routeInitInProgress = true;

  // 显示 loading
  pendingLoading = true;
  console.log('[RouteGuard] 显示 loading 动画');
  loadingService.showLoading();

  try {
    // 1. 获取菜单数据
    const menuList = await menuStore.getMenus();

    // 2. 验证菜单数据
    if (!validateMenuList(menuList)) {
      throw new Error('获取菜单列表失败，请重新登录');
    }

    // 3. 注册动态路由
    await registryRoutes(menuList);

    // 4. 验证目标路径权限
    const { path: validatedPath, hasPermission } = validatePath(to.path, menuList, HOME_URL || '/');

    // 初始化成功，重置进行中标记
    routeInitInProgress = false;

    // 5. 重新导航到目标路由
    if (!hasPermission) {
      // 无权限访问，跳转到首页
      closeLoading();

      // 输出警告信息
      message.warn(`[RouteGuard] 用户无权限访问路径: ${to.path}，已跳转到首页`);

      // 直接跳转到首页
      next({
        path: validatedPath,
        replace: true
      });
    } else {
      // 有权限，正常导航
      next({
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true
      });
    }
  } catch (error) {
    console.error('[RouteGuard] 动态路由注册失败:', error);

    // 关闭 loading
    closeLoading();

    // 标记初始化失败，防止死循环
    routeInitFailed = true;
    routeInitInProgress = false;

    // 跳转到 500 页面，使用 replace 避免产生历史记录
    next({ name: '500', replace: true });
  }
}

/**
 * 加载并注册动态路由
 * @returns {Promise<void>}
 */
/**
 * @description: 注册动态路由
 * @param {AppRouteRecordRaw[]} menuList 菜单列表
 * @return {Promise<void>} 无返回值的 Promise
 */
async function registryRoutes(menuList: AppRouteRecordRaw[]) {
  if (routerRegistered) {
    message.warning('[RouteRegistry] 路由已注册，跳过重复注册');
    return;
  }
  // 清空已有动态路由（防止重复添加）
  const removeRoutes: (() => void)[] = [];

  menuList.forEach(item => {
    if (item.name && !router.hasRoute(item.name)) {
      const removeRoute = item.meta?.isFull
        ? router.addRoute(item as RouteRecordRaw)
        : router.addRoute('layout', item as RouteRecordRaw);
      removeRoutes.push(removeRoute);
    }
  });
  console.log('动态路由加载完成');
  removeRouteFns = removeRoutes;
  routerRegistered = true;
}

/**
 * @description: 处理根路径重定向到首页逻辑
 * @param {RouteLocationNormalized} to 路由对象
 * @param {NavigationGuardNext} next 路由导航控制函数
 * @returns {boolean} true 表示已处理跳转，false 表示无需跳转
 */
function handleRootPathRedirect(to: RouteLocationNormalized, next: NavigationGuardNext): boolean {
  if (to.path !== '/') {
    return false;
  }

  if (HOME_URL && HOME_URL !== '/') {
    next({ path: HOME_URL, replace: true });
    return true;
  }

  return false;
}

/**
 * @description: 关闭 loading
 * @return {void} 无返回值
 */
function closeLoading(): void {
  if (pendingLoading) {
    nextTick(() => {
      console.log('[RouteGuard] 关闭 loading 动画');
      loadingService.hideLoading();
      pendingLoading = false;
    });
  }
}

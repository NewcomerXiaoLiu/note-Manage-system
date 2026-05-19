/*
 * @FilePath: /vue3-template-project/src/utils/router.ts
 * @Description: 路由菜单util
 */
import { AppRouteRecordRaw } from 'vue-router';

const modules = import.meta.glob('../views/**/*.vue');

/**
 * @desc: 解析路由
 * @param { Array } routerMap 后台返回的路由表
 * @return 返回
 */
export const generateRouter = (routerMap: AppRouteRecordRaw[]) => {
  return routerMap.map(item => {
    const currentRouter: AppRouteRecordRaw = {
      path: item.path,
      name: item.name,
      meta: item.meta,
      redirect: item.redirect
    };
    if (item.component && typeof item.component === 'string') {
      currentRouter.component = modules[`../views${item.component}.vue`];
    }
    // 是否存在子路由
    if (item?.children?.length) {
      currentRouter.children = generateRouter(item.children);
    }
    return currentRouter;
  });
};

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: AppRouteRecordRaw[]) {
  const newMenuList: AppRouteRecordRaw[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    if (item.children?.length) {
      item.children = getShowMenuList(item.children);
    }
    return !item.meta?.isHide;
  });
}

/**
 * @description: 验证菜单列表是否有效
 * @param {Array} menuList 菜单列表
 * @return {*}
 */
export function validateMenuList(menuList: AppRouteRecordRaw[]): boolean {
  return Array.isArray(menuList) && menuList.length > 0;
}

/**
 * @description: 路由权限验证函数
 * @description: 验证路径是否有权限访问，如果无权限则返回首页路径
 * @param targetPath 目标路径
 * @param menuList 菜单列表
 * @param homePath 首页路径（默认'/'）
 * @returns 验证结果对象，包含路径和权限状态
 */
export function validatePath(
  targetPath: string,
  menuList: any[],
  homePath: string = '/'
): { path: string; hasPermission: boolean } {
  // 内部辅助函数：构建菜单路径集合
  const buildMenuPathSet = (menuList: any[], pathSet: Set<string> = new Set()): Set<string> => {
    if (!Array.isArray(menuList) || menuList.length === 0) {
      return pathSet;
    }

    for (const menuItem of menuList) {
      // 跳过隐藏的菜单项或没有路径的项
      if (menuItem.meta?.isHide || !menuItem.path) {
        continue;
      }

      // 标准化路径
      const menuPath = menuItem.path.startsWith('/') ? menuItem.path : `/${menuItem.path}`;
      pathSet.add(menuPath);

      // 递归处理子菜单
      if (menuItem.children?.length) {
        buildMenuPathSet(menuItem.children, pathSet);
      }
    }

    return pathSet;
  };

  // 内部辅助函数：检查路径前缀匹配
  const checkPathPrefix = (targetPath: string, pathSet: Set<string>): boolean => {
    for (const menuPath of pathSet) {
      if (targetPath.startsWith(`${menuPath}/`)) {
        return true;
      }
    }
    return false;
  };

  // 主验证逻辑
  const hasPermission = (): boolean => {
    // 根路径始终允许访问
    if (targetPath === '/') {
      return true;
    }

    // 构建路径集合
    const pathSet = buildMenuPathSet(menuList);

    // 检查精确匹配或前缀匹配
    return pathSet.has(targetPath) || checkPathPrefix(targetPath, pathSet);
  };

  const permission = hasPermission();

  if (permission) {
    return { path: targetPath, hasPermission: true };
  }

  return { path: homePath, hasPermission: false };
}

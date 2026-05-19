// vue-router
// import 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  // 扩展 RouteMeta 类型，添加你需要的字段
  interface RouteMeta {
    title?: string; // 路由标题（必填）
    icon?: string; // 路由图标（必填）
    isFull?: boolean; // 是否全屏（可选）
    isAffix?: boolean; // 是否固定（可选）
    isKeepAlive?: boolean; // 是否缓存（可选）
    isHide?: boolean; // 是否隐藏（可选）
  }
  // 声明合并 RouteRecordRaw 接口，添加 meta 约束
  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children' | 'component'> {
    id?: number;
    meta?: RouteMeta;
    children?: AppRouteRecordRaw[];
    component?: string | (() => Promise<any>);
  }
}

export {};

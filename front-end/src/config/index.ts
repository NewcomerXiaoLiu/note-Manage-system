/*
 * @FilePath: /vue3-template-project/src/config/index.ts
 * @Description: 全局默认配置项
 */

const { BASE_URL } = import.meta.env;

// 首页地址（默认）
export const HOME_URL: string = '/home';

/** 免登录白名单 */
export const whiteList: Array<string> = ['/login'];

// iconfont图标地址
export const iconfontUrl = `${BASE_URL}javascript/iconfont.js?t=${new Date().getTime()}`;

// pagination分页默认配置
export const paginationDefault = {
  total: 0,
  current: 1,
  pageSize: 10, // 每页中显示10条数据
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'], // 每页中显示的数据
  showTotal: (total: any) => `共有 ${total} 条数据` // 分页中显示总的数据
};

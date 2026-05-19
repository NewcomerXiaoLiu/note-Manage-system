/*
 * @FilePath: /map-project-web/src/api/modules/mock.ts
 * @Description: mock-api
 */
import { get, post } from '@/api/methods';

export default {
  // 登录
  login: (data: any) => post<any>('/login', data),
  // 登出
  logout: () => post<any>('/logout'),
  // 列表
  list: (data: any) => get<any>('/project/list', data)
};

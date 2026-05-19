// 请求响应参数（不包含data）
export interface Result {
  code: string | number;
  msg: string;
  success: boolean;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页请求数据
export interface Pagination {
  pageNum?: number;
  pageSize?: number;
}

// 分页返回数据
export interface PaginationRes<T = any> {
  data: T;
  page: number;
  pageSize: number;
  total: number;
}

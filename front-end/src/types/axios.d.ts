/*
 * @FilePath: /project-code/src/types/axios.d.ts
 * @Description: axios
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    isNotIntercept?: boolean; // api请求跳过响应拦截器
    fileName?: string; // 文件名
  }
  // interface AxiosResponse {
  //   data: Result;
  //   current: number;
  //   list: any[];
  //   size: number;
  //   total: number;
  //   [key: string]: any;
  // }
}

export {};

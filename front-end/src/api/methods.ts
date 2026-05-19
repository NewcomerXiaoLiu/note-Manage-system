/*
 * @FilePath: /project-code/src/api/methods.ts
 * @Description: 封装请求方法，简化 axios 的使用
 */

import { AxiosRequestConfig } from 'axios';
import service from './index';

// 封装请求方法
const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  return service(config);
};

// get 请求
export const get = <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
  request<T>({ method: 'GET', url, params, ...config });

// post 请求
export const post = <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
  request<T>({ method: 'POST', url, data, ...config });

// put 请求
export const put = <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
  request<T>({ method: 'PUT', url, data, ...config });

// patch 请求
export const patch = <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
  request<T>({ method: 'PATCH', url, data, ...config });

// delete 请求
export const del = <T>(url: string, data?: object, config?: AxiosRequestConfig) =>
  request<T>({ method: 'DELETE', url, data, ...config });

// 下载文件 GET 请求（自动处理 blob）
export const download = <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
  request<T>({ method: 'GET', url, params, responseType: 'blob', ...config });

// 文件上传 POST 请求（自动处理 FormData）
export const upload = <T>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> => {
  if (!data || typeof data !== 'object') {
    throw new Error('上传数据必须是一个对象');
  }

  const formData = new FormData();

  // 遍历对象，智能添加到 FormData
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
      } else if (Array.isArray(value) && value.some(item => item instanceof File || item instanceof Blob)) {
        // 支持 [file1, file2] 或 [{ file: File }, ...] 等混合数组（仅上传文件部分）
        value.forEach(item => {
          if (item instanceof File || item instanceof Blob) {
            formData.append(key, item);
          }
        });
      } else {
        // 普通字段：字符串、数字、布尔值、对象等
        // 对象/数组转为 JSON 字符串（后端需 JSON.parse）
        if (value !== null && typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    }
  }

  return request<T>({
    method: 'POST',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  });
};

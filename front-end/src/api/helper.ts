/*
 * @FilePath: /project-code/src/api/helper.ts
 * @Description: axios请求防抖和取消重复请求
 */
import axios, { AxiosRequestConfig, Canceler } from 'axios';

// 用于存储每个请求的取消令牌
const pendingRequests = new Map<string, Canceler>();

// 生成请求的唯一键
const generateRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};

// 添加请求到 pendingRequests
export const addPendingRequest = async (config: AxiosRequestConfig): Promise<void> => {
  const requestKey = generateRequestKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pendingRequests.has(requestKey)) {
        pendingRequests.set(requestKey, cancel);
      }
    });
};

// 移除请求从 pendingRequests
export const removePendingRequest = async (config: AxiosRequestConfig): Promise<void> => {
  if (!config) return;
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey);
    cancel && cancel('取消重复请求');
    pendingRequests.delete(requestKey);
  }
};

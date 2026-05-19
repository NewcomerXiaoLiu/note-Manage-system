/*
 * @FilePath: /vue3-template-project/src/api/index.ts
 * @Description: axios封装
 */
import { message } from 'ant-design-vue';
import axios, { AxiosResponse, isCancel } from 'axios';
import FileSaver from 'file-saver';
import { joinURL } from 'ufo';
import { addPendingRequest, removePendingRequest } from './helper';
import { ResultData } from './interface';
import { HTTP_CODE } from '@/enums/http';
import { useUserStore } from '@/store/modules/user';

type BlobPart = string | Blob;

const { VITE_APP_API_PREFIX, VITE_APP_API_HOST } = import.meta.env;

export const baseURL = joinURL(VITE_APP_API_HOST);

const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000,
  baseURL: VITE_APP_API_PREFIX,
  // responseType: 'json',
  withCredentials: true, // 是否允许带cookie
  // paramsSerializer:(params) => Qs.stringify(params, {allowDots: true}), // 开启qs序列化
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
    // 'Authorization': '75ea81c1949747b0864ec976551bc377'
  }
});

// 添加请求拦截器
service.interceptors.request.use(
  async config => {
    // console.log('【axios request】', config);
    const userStore = await useUserStore();
    if (userStore.isLogin) {
      // console.log('userStore', userStore);
      config.headers.Authorization = userStore.info?.accessToken || '';
    }
    // 在发送请求之前，检查是否存在相同的请求，如果有则取消旧的请求
    await removePendingRequest(config);
    // 将新请求添加到 pendingRequests 中
    await addPendingRequest(config);
    return config;
  },
  error => {
    // console.error('【axios request error】', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成后，移除该请求
    removePendingRequest(response.config);
    console.log('【axios response】', response);
    // debugger;
    const res = response.data as ResultData<any>;
    // 跳过拦截
    if (response.config.isNotIntercept) {
      return Promise.resolve(res);
    }
    // 假设合法的业务状态码为：0、200、'200'（根据实际业务调整）
    const validCodes = [0, 200, '200'];
    if ([200, 201].includes(response.status) && validCodes.includes(res.code)) {
      return Promise.resolve(res.data);
    } else if (response.config.responseType === 'blob') {
      // 处理blob流文件
      try {
        // 获取文件的原始名称
        let fileName = response.config.params.fileName || '';
        if (!fileName && response.headers['content-disposition']) {
          const cd = decodeURI(response.headers['content-disposition']);
          if (cd.indexOf('filename=') !== -1) {
            fileName = cd.split('filename=')[1];
          } else if (cd.indexOf('filename*= UTF-8') !== -1) {
            fileName = cd.split(`filename*= UTF-8${''}`)[1];
          } else {
            fileName = cd.split('filename*=')[1];
          }
          if (fileName) {
            fileName = fileName.replace(`utf-8${''}`, '').replace(/^"|"$/g, ''); // 去掉前后的引号
          }
        }
        FileSaver.saveAs(new Blob([response.data as BlobPart]), fileName); // 保存文件
        console.log(fileName);
        return Promise.resolve(true); // 处理成功，返回 true
      } catch (error) {
        console.error('Error saving blob file:', error);
        message.error('文件连接失败，请重试！'); // 显示错误消息
        return Promise.resolve(false); // 处理失败，返回 false
      }
    } else {
      const msg = res.msg || '请求失败'; // 返回接口返回提示信息
      message.error(msg);
      return Promise.reject(res);
    }
  },
  error => {
    console.error('【axios response error】', error);
    message.destroy();
    console.log(isCancel(error));
    if (isCancel(error)) return Promise.reject(error);

    if (error.response) {
      if (error.response.status === 401) {
        message.destroy();
        message.error('登录失效，请重新登录');
        useUserStore().logOut();
        return;
      } else {
        const errMsg = error.response.data.msg || HTTP_CODE[error.response.status];
        if (errMsg) {
          message.error(errMsg);
        }
      }
      return Promise.reject(error);
    } else {
      message.error('请求超时, 请刷新重试');
      return Promise.reject(new Error('请求超时, 请刷新重试'));
    }
  }
);

export default service;

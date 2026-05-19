/*
 * @FilePath: /vue3-template-project/src/store/piniaPersist.ts
 * @Description: pinia 持久化参数配置
 */
import { PersistenceOptions } from 'pinia-plugin-persistedstate';

/**
 * 1.持久化 user store 的所有 state 字段
 * persist: piniaPersistConfig('user')
 * 2.使用 pick 选择需要持久化的字段
 * persist: piniaPersistConfig('user', ['token', 'userInfo', 'settings'])
 * 3.使用 omit 排除不需要持久化的字段
 * persist: piniaPersistConfig('user', undefined, ['temporaryData'])
 * */

/**
 * @description pinia 持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} pick 需要持久化的 state name
 * @param {Array} omit 不需要持久化的 state name
 * @return persist
 * */
const piniaPersistConfig = (key: string, pick?: string[], omit?: string[]): PersistenceOptions => ({
  key, //存储名称
  storage: localStorage, // 存储方式
  // paths → pick/omit: 4.x 版本使用 pick 和 omit 来代替原来的 paths
  ...(pick && pick.length > 0 && { pick }),
  ...(omit && omit.length > 0 && { omit }),
  serializer: {
    //定义怎么存储和怎么获取
    serialize: JSON.stringify, //取
    deserialize: JSON.parse //存
  }
});

export default piniaPersistConfig;

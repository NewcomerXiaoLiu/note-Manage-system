### API 请求方法封装文档

本模块封装了基于 axios 的常用 HTTP 请求方法，简化调用流程，并提供 通用文件上传 能力。

### 通用说明

所有方法均返回 Promise<T>，可配合 async/await 使用。
自动集成：
请求/响应拦截器（错误提示、重复请求取消等）
基础 URL（由 VITE_APP_API_PREFIX 配置）
Cookie 携带（withCredentials: true）

### 导入使用

```js
import { get, post, put, patch, del, upload } from '@/api/methods';

interface List {
  name: string;
}


export default {
  list: (data: { name: string }) => get<List[]>('/login', data),
}

// 使用示例 GET请求示例，结合await-to-js
import to from 'await-to-js';
import api from './api';

const [err, res] = await to(api.list({ name: 'test' }));
if (err) return;
console.log(res);
```

/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, any>;
  export default component;
}

declare module 'nprogress';

declare module 'file-saver';

// 全局变量声明
declare const __APP_VERSION__: string; // 版本号

// 环境变量提示
// interface ImportMetaEnv {
//   VITE_BASE_API_URL: string
// }

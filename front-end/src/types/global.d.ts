declare global {
  interface Window {
    // 声明 mountApp 为可选的函数类型
    mountApp: () => void;
  }
}

// 确保该文件被视为模块（避免 TS 报错）
export {};

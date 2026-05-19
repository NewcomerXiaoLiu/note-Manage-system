/*
 * @FilePath: /vue3-template-project/src/utils/version/checkUpdate.worker.ts
 * @Description: 更新检查Worker线程
 */

// 定义Worker的消息类型
interface WorkerMessage {
  type: 'start' | 'stop' | 'recheck' | 'destroy';
  delay?: number;
}

// 检查间隔（默认5分钟）
const DEFAULT_CHECK_INTERVAL = 5 * 60 * 1000;
// const DEFAULT_CHECK_INTERVAL = 10 * 1000;
let checkInterval: number | null = null;
let lastEtag = '';

/**
 * 检查更新函数
 */
const checkForUpdates = async () => {
  try {
    console.log('检查更新函数', Date.now());
    // 发送HEAD请求获取version.json的响应头
    const response = await fetch('/version.json?v=' + Date.now(), {
      method: 'HEAD',
      cache: 'no-cache'
    });

    const etag = response.headers.get('etag');

    // 更新lastEtag
    const previousEtag = lastEtag;
    if (etag) {
      lastEtag = etag;
    }

    // 只在ETag从有到变化时才认为有更新
    // 这样避免首次检查就认为有更新
    if (previousEtag && etag && etag !== previousEtag) {
      // 发送消息给主线程，通知有更新
      self.postMessage({ type: 'hasUpdate' });
      // 清除定时器，避免重复提示
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }
  } catch (error) {
    console.error('Worker检查更新失败:', error);
  }
};

/**
 * 开始定时检查
 */
const startChecking = (interval = DEFAULT_CHECK_INTERVAL) => {
  // 先执行一次检查
  checkForUpdates();

  // 设置定时检查
  checkInterval = setInterval(checkForUpdates, interval) as unknown as number;
};

/**
 * 停止定时检查
 */
const stopChecking = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
};

// 监听主线程消息
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, delay } = event.data;

  switch (type) {
    case 'start':
      // 开始检查
      startChecking();
      break;
    case 'stop':
      // 停止检查
      stopChecking();
      break;
    case 'recheck':
      // 延迟后重新检查
      stopChecking();
      setTimeout(() => {
        startChecking(delay || DEFAULT_CHECK_INTERVAL);
      }, delay || 0);
      break;
    case 'destroy':
      // 销毁Worker
      stopChecking();
      self.close();
      break;
  }
};

// 导出类型定义，用于TypeScript检查
export default {} as typeof Worker & (new () => Worker);

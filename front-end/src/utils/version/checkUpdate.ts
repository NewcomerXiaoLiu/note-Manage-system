/*
 * @FilePath: /vue3-template-project/src/utils/version/checkUpdate.ts
 * @Description: 检查前端更新版本
 */
import { Button, notification, Space } from 'ant-design-vue';
import { h } from 'vue';

// 保存上次的ETag
let lastEtag = '';
// 是否有更新
let hasUpdate = false;
// Worker实例
let worker: Worker | null = null;

/**
 * 检查更新函数
 * 通过对比version.json的ETag来判断是否有更新
 */
export const checkUpdate = async (): Promise<boolean> => {
  try {
    // 发送HEAD请求获取version.json的响应头
    const response = await fetch(`/version.json?v=${Date.now()}`, {
      method: 'HEAD'
    });

    // 获取最新的ETag
    const etag = response.headers.get('etag');
    console.log(etag);
    // 如果是首次检查或者ETag发生变化，则认为有更新
    // 为了测试目的，首次检查也可以认为有更新
    hasUpdate = !!lastEtag && etag !== lastEtag;
    // hasUpdate = !lastEtag || (!!lastEtag && etag !== lastEtag);

    // 保存当前ETag
    lastEtag = etag || '';

    return hasUpdate;
  } catch (error) {
    console.error('检查更新失败:', error);
    return false;
  }
};

/**
 * 获取version.json的内容
 */
export const getVersionContent = async (): Promise<{ timestamp: number; msg: string } | null> => {
  try {
    const response = await fetch('/version.json');
    return await response.json();
  } catch (error) {
    console.error('获取version.json内容失败:', error);
    return null;
  }
};

/**
 * 显示更新提示
 */
export const showUpdateNotification = async () => {
  const version = await getVersionContent();
  const updateMsg = version?.msg || '系统有新版本发布';

  notification.open({
    message: '系统更新提示',
    description: () => h('div', [h('div', updateMsg), h('div', '请点击「立即刷新」更新到最新版本')]),
    btn: () =>
      h(Space, [
        h(
          Button,
          {
            type: 'primary',
            onClick: () => {
              // 销毁Worker
              if (worker) {
                worker.postMessage({ type: 'destroy' }); // 销毁Worker实例
                worker.terminate(); // 终止Worker
              }
              // 刷新页面
              location.reload();
            }
          },
          { default: () => '立即刷新' }
        ),
        h(
          Button,
          {
            type: 'primary',
            onClick: () => {
              // 5分钟后再次检查更新
              if (worker) {
                worker.postMessage({ type: 'recheck', delay: 5 * 60 * 1000 });
                // worker.postMessage({ type: 'recheck', delay: 10 * 1000 });
              }
              notification.close(version?.timestamp?.toString() || 'update-notification');
            }
          },
          { default: () => '稍后提示' }
        )
      ]),
    key: version?.timestamp?.toString() || 'update-notification',
    duration: 0,
    onClose: () => {
      // 5分钟后再次检查更新
      if (worker) {
        worker.postMessage({ type: 'recheck', delay: 5 * 60 * 1000 });
        // worker.postMessage({ type: 'recheck', delay: 10 * 1000 });
      }
    }
  });
};

/**
 * 初始化更新检查
 * 仅在生产环境运行
 */
export const initUpdateChecker = () => {
  // 只在生产环境执行
  console.log(import.meta.env);
  if (import.meta.env.PROD) {
    // 立即进行一次更新检查
    checkUpdate().then(async updateAvailable => {
      if (updateAvailable) {
        await showUpdateNotification();
      } else {
        // 如果没有更新，启动Worker进行轮询
        startUpdateWorker();
      }
    });
  }
};

/**
 * 启动更新检查Worker
 */
export const startUpdateWorker = () => {
  if (worker) return;

  try {
    // 创建Worker
    worker = new Worker(new URL('./checkUpdate.worker.ts', import.meta.url), {
      type: 'module'
    });

    // 监听Worker消息
    worker.onmessage = async event => {
      console.log('Worker消息:', event);
      if (event.data.type === 'hasUpdate') {
        await showUpdateNotification();
      }
    };

    // 启动检查
    worker.postMessage({ type: 'start' });
  } catch (error) {
    console.error('创建Worker失败:', error);
  }
};

/**
 * 停止更新检查
 */
export const stopUpdateChecker = () => {
  if (worker) {
    worker.postMessage({ type: 'destroy' });
    worker.terminate();
    worker = null;
  }
};

export default {
  checkUpdate,
  showUpdateNotification,
  initUpdateChecker,
  stopUpdateChecker
};

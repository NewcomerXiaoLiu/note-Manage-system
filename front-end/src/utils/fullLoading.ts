/*
 * @FilePath: /vue3-template-project/src/utils/fullLoading.ts
 * @Description: 全屏加载动画工具类
 */
import { LoadingOutlined } from '@ant-design/icons-vue';
import { Spin } from 'ant-design-vue';
import { createApp, h, ref } from 'vue';

// 定义 Loading 实例类型
interface LoadingInstance {
  show: (tip?: string) => void;
  hide: () => void;
}

// 创建全局 loading 实例
let loadingInstance: LoadingInstance | null = null;

export const loadingService = {
  /**
   * 显示全屏加载
   * @param tip 加载提示文本
   */
  showLoading(tip: string = '加载中...') {
    // 如果已经存在实例，先销毁
    if (loadingInstance) {
      loadingInstance.hide();
    }

    // 创建挂载点
    const container = document.createElement('div');
    container.id = 'global-loading-container';
    document.body.appendChild(container);

    // 创建响应式数据
    const visible = ref(true);
    const loadingTip = ref(tip);

    // 创建应用实例
    const app = createApp({
      setup() {
        const show = (newTip: string = '加载中...') => {
          loadingTip.value = newTip;
          visible.value = true;
        };

        const hide = () => {
          visible.value = false;
          // 延迟移除DOM
          setTimeout(() => {
            if (app) {
              app.unmount();
              const container = document.getElementById('global-loading-container');
              if (container) {
                document.body.removeChild(container);
              }
            }
          }, 300);
        };

        // 保存实例引用
        loadingInstance = { show, hide };

        return { visible, loadingTip, show, hide };
      },

      render() {
        if (!this.visible) return null;

        return h(
          'div',
          {
            class: 'global-loading-container',
            style: {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          },
          [
            h(Spin, {
              spinning: true,
              // tip: this.loadingTip,
              tip: h('span', { style: { fontSize: '16px' } }, this.loadingTip),
              // size: 'large',
              indicator: h(LoadingOutlined, {
                style: {
                  fontSize: '36px',
                  marginBottom: '10px'
                },
                spin: true
              })
            })
          ]
        );
      }
    });

    app.mount(container);
  },

  /**
   * 隐藏全屏加载
   */
  hideLoading() {
    if (loadingInstance) {
      loadingInstance.hide();
      loadingInstance = null;
    }
  },

  /**
   * 销毁加载实例
   */
  destroy() {
    this.hideLoading();
  }
};

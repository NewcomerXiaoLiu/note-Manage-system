/*
 * @FilePath: /project-code/src/hooks/useEcharts.ts
 * @Description: ECharts 进行图表渲染的自定义 Hook
 */
import * as echarts from 'echarts';
import { onBeforeUnmount, onDeactivated, onMounted, reactive, toRefs, watch } from 'vue';
import type { EChartsType } from 'echarts';
import 'echarts-liquidfill';
// import './echarts-auto-tooltip.js';

/**
 * 使用 ECharts 绘制图表的自定义 Hook。
 *
 * @param el Vue 组件的 ref 对象，用于挂载 ECharts 实例的 DOM 元素。
 * @param watchCallback 用于触发数据更新的回调函数，该函数的返回值将作为 watch 的源。
 * @param setOptionFunc 用于设置 ECharts 配置项的回调函数，该函数的返回值将被用于更新 ECharts 实例的配置项。
 * @returns 返回一个对象，包含响应式的状态以及 echarts 实例的引用。
 */
export const useEcharts = (el: any, watchCallback: () => any, setOptionFunc: () => Record<string, any>) => {
  let echart: EChartsType | null = null; //此处不能赋值给响应式变量，否则tootip无法显示
  // let loopTooltip: any = null;
  const state = reactive({
    option: {},
    loading: true,
    myChart: null as any,
    setOption: () => {
      // 更新chart的option配置
      if (echart) {
        state.option = setOptionFunc();
        echart.setOption(setOptionFunc());
      }
    },
    resize: () => echartsResize()
  });

  // 初始化 ECharts 实例
  const initEchart = () => {
    echart = echarts.init(el.value);
    echart.setOption(state.option);
    state.myChart = echart;

    // if (!state.option.hasOwnProperty('stopLoop')) {
    //   // 是否自动轮播tooltip
    //   loopTooltip = tools.loopShowTooltip(echart, state.option, {
    //     interval: 3000,
    //     loopSeries: true
    //   });
    // }
  };

  // 重新调整 ECharts 图表大小
  const echartsResize = () => {
    if (echart) {
      echart.resize();
    }
  };

  window.addEventListener('resize', echartsResize);

  onMounted(() => {
    state.option = setOptionFunc();
    initEchart();
  });

  // 防止 echarts 页面 keepAlive 时，还在继续监听页面
  onDeactivated(() => {
    window.removeEventListener('resize', echartsResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', echartsResize);
  });

  watch(watchCallback(), (data, preData) => {
    state.option = setOptionFunc();
    if (!echart) {
      // 初始化echart
      initEchart();
    } else {
      // 更新数据
      // loopTooltip && loopTooltip.clearLoop();
      echart.dispose();
      initEchart();
    }
  });

  return {
    ...toRefs(state)
  };
};

/*
 * @FilePath: /vue3-template-project/src/store/modules/setting.ts
 * @Description: 系统设置状态管理模块
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import piniaPersistConfig from '../piniaPersist';
import { SETTING_DEFAULT_CONFIG } from '@/config/setting';

/**
 * 系统设置状态管理
 * 管理应用的菜单、主题、界面显示等各项设置
 */
export const useSettingStore = defineStore(
  'settingStore',
  () => {
    /** 是否显示进度条 */
    const showNprogress = ref(SETTING_DEFAULT_CONFIG.showNprogress);

    /** 菜单模式：system-系统菜单 notes-笔记菜单(分组树) */
    const menuMode = ref<'system' | 'notes'>('system');

    /**
     * 切换进度条显示
     */
    const setNprogress = () => {
      showNprogress.value = !showNprogress.value;
    };

    /** 切换菜单模式 */
    const toggleMenuMode = () => {
      menuMode.value = menuMode.value === 'system' ? 'notes' : 'system';
    };

    return {
      showNprogress,
      setNprogress,
      menuMode,
      toggleMenuMode
    };
  },
  {
    persist: piniaPersistConfig('settingStore')
  }
);

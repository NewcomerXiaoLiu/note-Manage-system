/**
 * 系统设置默认值配置
 *
 * 统一管理系统设置的所有默认值
 */

/**
 * 系统设置默认值配置
 */
export const SETTING_DEFAULT_CONFIG = {
  /** 是否显示进度条 */
  showNprogress: false
};

/**
 * 获取设置默认值
 * @returns 设置默认值对象
 */
export function getSettingDefaults() {
  return { ...SETTING_DEFAULT_CONFIG };
}

/**
 * 重置为默认设置
 * @param currentSettings 当前设置对象
 */
export function resetToDefaults(currentSettings: Record<string, any>) {
  const defaults = getSettingDefaults();
  Object.keys(defaults).forEach(key => {
    if (key in currentSettings) {
      currentSettings[key] = defaults[key as keyof typeof defaults];
    }
  });
}

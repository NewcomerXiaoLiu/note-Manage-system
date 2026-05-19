<template>
  <a-config-provider
    :locale="locale"
    :theme="themeConfig"
  >
    <a-style-provider
      hash-priority="high"
      :transformers="[legacyLogicalPropertiesTransformer]"
    >
      <router-view />
    </a-style-provider>
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { legacyLogicalPropertiesTransformer } from 'ant-design-vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { ref } from 'vue';

  const locale = ref(zhCN);

  const themeConfig = {
    token: {
      colorPrimary: '#3d9b8f',
      colorSuccess: '#3d9b8f',
      colorWarning: '#f0b34b',
      colorError: '#e8927c',
      colorInfo: '#5b8def',
      borderRadius: 6,
      colorBgLayout: '#f8f9fa',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorder: '#e8ecf0',
      colorBorderSecondary: '#f0f2f4',
      colorText: '#1a1a2e',
      colorTextSecondary: '#6b7280',
      colorTextTertiary: '#9ca3af',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.06)',
    },
    components: {
      Layout: {
        colorBgHeader: '#ffffff',
        colorBgBody: '#f8f9fa',
        colorBgTrigger: '#ffffff',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorItemText: '#6b7280',
        colorItemTextHover: '#1a1a2e',
        colorItemTextSelected: '#3d9b8f',
        colorItemBgHover: '#f0faf8',
        colorItemBgSelected: '#f0faf8',
        colorSubItemBg: 'transparent',
        radiusItem: 6,
        radiusSubMenuItem: 6,
      },
      Button: {
        colorPrimaryHover: '#2d8b7f',
        colorPrimaryActive: '#1e7b6f',
        borderRadius: 6,
        controlHeight: 36,
      },
      Card: {
        borderRadius: 12,
        padding: 20,
        paddingLG: 20,
        colorBorderSecondary: '#f0f2f4',
      },
      Table: {
        borderRadius: 8,
        headerBg: '#f8f9fa',
        headerColor: '#6b7280',
        rowHoverBg: '#f8f9fa',
        borderColor: '#f0f2f4',
      },
      Modal: {
        borderRadius: 12,
        borderRadiusLG: 12,
        headerBg: '#ffffff',
        contentBg: '#ffffff',
        footerBg: '#f8f9fa',
      },
      Form: {
        labelColor: '#6b7280',
        labelFontSize: 13,
      },
      Input: {
        borderRadius: 6,
        hoverBorderColor: '#3d9b8f',
        activeBorderColor: '#3d9b8f',
      },
      Select: {
        borderRadius: 6,
        hoverBorderColor: '#3d9b8f',
      },
      Statistic: {
        contentFontSize: 28,
      },
      Pagination: {
        borderRadius: 6,
      },
      Popconfirm: {
        borderRadius: 8,
      },
    },
  };
</script>

<style lang="scss" scoped></style>

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
      colorPrimary: '#8ab4c8',
      colorSuccess: '#8ab4c8',
      colorWarning: '#e8c87a',
      colorError: '#e8aFAF',
      colorInfo: '#8ab4c8',
      borderRadius: 8,
      colorBgLayout: '#f4f6f8',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorder: '#e6eaf0',
      colorBorderSecondary: '#eef1f4',
      colorText: '#2d3436',
      colorTextSecondary: '#6b7280',
      colorTextTertiary: '#9ca3af',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      boxShadowSecondary: '0 4px 16px rgba(138, 180, 200, 0.1)',
    },
    components: {
      Layout: {
        colorBgHeader: 'rgba(255,255,255,0.88)',
        colorBgBody: '#f4f6f8',
        colorBgTrigger: '#ffffff',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorItemText: '#6b7280',
        colorItemTextHover: '#2d3436',
        colorItemTextSelected: '#8ab4c8',
        colorItemBgHover: '#f0f6f9',
        colorItemBgSelected: '#f0f6f9',
        colorSubItemBg: 'transparent',
        radiusItem: 8,
        radiusSubMenuItem: 8,
      },
      Button: {
        colorPrimaryHover: '#7aa8bc',
        colorPrimaryActive: '#6a9cb0',
        borderRadius: 8,
        controlHeight: 36,
      },
      Card: {
        borderRadius: 14,
        padding: 24,
        paddingLG: 24,
        colorBorderSecondary: '#eef1f4',
      },
      Table: {
        borderRadius: 10,
        headerBg: '#f4f6f8',
        headerColor: '#6b7280',
        rowHoverBg: '#f8fafb',
        borderColor: '#eef1f4',
      },
      Modal: {
        borderRadius: 14,
        borderRadiusLG: 14,
        headerBg: '#ffffff',
        contentBg: '#ffffff',
        footerBg: '#f8fafb',
      },
      Form: {
        labelColor: '#6b7280',
        labelFontSize: 13,
      },
      Input: {
        borderRadius: 8,
        hoverBorderColor: '#8ab4c8',
        activeBorderColor: '#8ab4c8',
      },
      Select: {
        borderRadius: 8,
        hoverBorderColor: '#8ab4c8',
      },
      Statistic: {
        contentFontSize: 28,
      },
      Pagination: {
        borderRadius: 8,
      },
      Popconfirm: {
        borderRadius: 10,
      },
      Tabs: {
        colorBorderSecondary: '#eef1f4',
      },
      Tag: {
        borderRadius: 6,
      },
    },
  };
</script>

<style lang="scss" scoped></style>

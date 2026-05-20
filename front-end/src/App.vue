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
      colorPrimary: '#c1694f',
      colorSuccess: '#8fa892',
      colorWarning: '#d4a76a',
      colorError: '#b8796a',
      colorInfo: '#c1694f',
      borderRadius: 8,
      colorBgLayout: '#f5f0eb',
      colorBgContainer: '#fffaf5',
      colorBgElevated: '#ffffff',
      colorBorder: '#e5d9ce',
      colorBorderSecondary: '#f0e8e0',
      colorText: '#1a1412',
      colorTextSecondary: '#7a6b60',
      colorTextTertiary: '#b0a297',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: 14,
      boxShadow: '0 1px 3px rgba(60, 40, 30, 0.06)',
      boxShadowSecondary: '0 4px 12px rgba(60, 40, 30, 0.08)',
    },
    components: {
      Layout: {
        colorBgHeader: 'rgba(255,250,245,0.88)',
        colorBgBody: '#f5f0eb',
        colorBgTrigger: '#fffaf5',
      },
      Menu: {
        colorItemBg: 'transparent',
        colorItemText: '#7a6b60',
        colorItemTextHover: '#1a1412',
        colorItemTextSelected: '#c1694f',
        colorItemBgHover: '#f8f0eb',
        colorItemBgSelected: '#f8f0eb',
        colorSubItemBg: 'transparent',
        radiusItem: 8,
        radiusSubMenuItem: 8,
      },
      Button: {
        colorPrimaryHover: '#a8543d',
        colorPrimaryActive: '#8f4431',
        borderRadius: 8,
        controlHeight: 36,
      },
      Card: {
        borderRadius: 14,
        padding: 24,
        paddingLG: 24,
        colorBorderSecondary: '#f0e8e0',
      },
      Table: {
        borderRadius: 10,
        headerBg: '#f5f0eb',
        headerColor: '#7a6b60',
        rowHoverBg: '#fcf8f5',
        borderColor: '#f0e8e0',
      },
      Modal: {
        borderRadius: 14,
        borderRadiusLG: 14,
        headerBg: '#fffaf5',
        contentBg: '#fffaf5',
        footerBg: '#f5f0eb',
      },
      Form: {
        labelColor: '#7a6b60',
        labelFontSize: 13,
      },
      Input: {
        borderRadius: 8,
        hoverBorderColor: '#c1694f',
        activeBorderColor: '#c1694f',
      },
      Select: {
        borderRadius: 8,
        hoverBorderColor: '#c1694f',
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
        colorBorderSecondary: '#f0e8e0',
      },
      Tag: {
        borderRadius: 6,
      },
    },
  };
</script>

<style lang="scss" scoped></style>

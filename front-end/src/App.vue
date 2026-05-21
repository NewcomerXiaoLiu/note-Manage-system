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
      colorPrimary: '#1677ff',
    },
  };
</script>

<style lang="scss" scoped></style>

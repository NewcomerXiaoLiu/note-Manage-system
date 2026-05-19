<template>
  <a-layout class="layout">
    <a-layout-sider
      :collapsed="collapsed"
      :trigger="null"
      class="layout-sider"
    >
      <a-flex
        vertical
        style="overflow: hidden; height: 100%"
      >
        <layout-logo
          :collapsed="collapsed"
          style="flex: none"
        />
        <div class="sider-menu-wrapper">
          <layout-menu
            :collapsed="collapsed"
            style="flex: 1"
          />
        </div>
      </a-flex>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <layout-header v-model:collapsed="collapsed" />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <layout-view-content />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import layoutHeader from './header/header.vue';
  import layoutLogo from './logo/logo.vue';
  import layoutMenu from './menu/menu.vue';
  import layoutViewContent from './view/view-content.vue';

  const collapsed = ref<boolean>(false);
</script>

<style lang="scss" scoped>
  .layout {
    display: flex;
    height: 100%;
    overflow: hidden;

    .layout-sider {
      background: #ffffff !important;
      border-right: 1px solid var(--color-border);
      box-shadow: var(--shadow-right);
      z-index: 20;

      .sider-menu-wrapper {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 0 8px 12px;
      }
    }

    .layout-header {
      height: 56px;
      padding: 0;
      line-height: 56px;
      background: var(--color-bg-header);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border-light);
      position: relative;
      z-index: 10;
    }

    .layout-content {
      background: var(--color-bg-page);
    }
  }
</style>

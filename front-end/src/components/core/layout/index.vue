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
          v-if="settingStore.menuMode === 'system'"
          :collapsed="collapsed"
          style="flex: none"
        />
        <div class="sider-menu-wrapper">
          <layout-menu
            v-if="settingStore.menuMode === 'system'"
            :collapsed="collapsed"
            style="flex: 1"
          />
          <sidebar-groups
            v-else
            @select="onGroupSelect"
          />
        </div>
      </a-flex>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header">
        <layout-header v-model:collapsed="collapsed" />
      </a-layout-header>
      <a-layout-content class="layout-content">
        <layout-view-content v-if="settingStore.menuMode === 'system'" />
        <notes-content
          v-else
          :selected-group-id="selectedGroupId"
        />
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
  import sidebarGroups from './mode-notes/sidebar-groups.vue';
  import notesContent from './mode-notes/notes-content.vue';
  import { useSettingStore } from '@/store/modules/setting';

  const collapsed = ref<boolean>(false);
  const settingStore = useSettingStore();
  const selectedGroupId = ref<string | undefined>(undefined);

  const onGroupSelect = (groupId: string | undefined) => {
    selectedGroupId.value = groupId;
  };
</script>

<style lang="scss" scoped>
  .layout {
    display: flex;
    height: 100%;
    overflow: hidden;

    .layout-sider {
      background: var(--color-bg-card) !important;
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

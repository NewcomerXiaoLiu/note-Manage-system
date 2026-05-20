<template>
  <div class="layout__header">
    <div class="header__left">
      <span class="trigger" @click="handleColl">
        <menu-unfold-outlined v-if="collapsed" />
        <menu-fold-outlined v-else />
      </span>
      <span class="mode-toggle" @click="settingStore.toggleMenuMode()" :title="settingStore.menuMode === 'system' ? '切换到笔记菜单' : '切换到系统菜单'">
        <appstore-outlined v-if="settingStore.menuMode === 'notes'" />
        <unordered-list-outlined v-else />
      </span>
    </div>
    <a-flex
      class="header__right"
      gap="middle"
      align="center"
    >
      <Avatar />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
  import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
  import Avatar from './components/avatar.vue';
  import { useSettingStore } from '@/store/modules/setting';

  interface Props {
    collapsed: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {});
  const emits = defineEmits(['update:collapsed']);
  const settingStore = useSettingStore();

  const handleColl = () => {
    emits('update:collapsed', !props.collapsed);
  };
</script>

<style lang="scss" scoped>
  .layout__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;

    .header__left {
      .trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 16px;
        color: var(--color-text-secondary);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          color: var(--color-primary);
          background: var(--color-primary-light);
        }
      }

      .mode-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 16px;
        color: var(--color-text-secondary);
        border-radius: 6px;
        cursor: pointer;
        margin-left: 4px;
        transition: all 0.15s ease;

        &:hover {
          color: var(--color-primary);
          background: var(--color-primary-light);
        }
      }
    }
  }
</style>

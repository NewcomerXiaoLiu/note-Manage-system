<template>
  <div class="layout-menu">
    <a-menu
      v-if="settingStore.menuMode === 'system'"
      v-model:open-keys="state.openKeys"
      mode="vertical"
      :selected-keys="state.selectedKeys"
      theme="dark"
      @click="clickMenuItem"
    >
      <menu-item
        :menus="menus"
        :collapsed="collapsed"
      />
    </a-menu>
    <sidebar-groups
      v-else
      @select="onGroupSelect"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onBeforeMount, reactive, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import sidebarGroups from '../mode-notes/sidebar-groups.vue';
  import MenuItem from './menu-item.vue';
  import { useMenuStore } from '@/store/modules/menu';
  import { useSettingStore } from '@/store/modules/setting';

  defineProps<{ collapsed: boolean }>();

  const route = useRoute();
  const router = useRouter();
  const menuStore = useMenuStore();
  const settingStore = useSettingStore();

  const state = reactive({
    openKeys: [] as string[],
    selectedKeys: [] as string[]
  });

  const menus = computed(() => menuStore.showMenuListGet);

  const clickMenuItem = ({ key }: { key: string }) => {
    router.push({ path: key });
  };

  const setMenuKey = () => {
    route.matched.forEach(item => {
      state.openKeys = [item.path as string];
    });
    state.selectedKeys = [route.path as string];
  };

  const onGroupSelect = (groupId: string | undefined) => {
    router.push({ path: '/notes', query: groupId ? { groupId } : undefined });
  };

  onBeforeMount(setMenuKey);
  watch(route, setMenuKey);
</script>

<style lang="scss" scoped>
  .layout-menu {
    height: 100%;
    overflow-y: auto;
  }
</style>

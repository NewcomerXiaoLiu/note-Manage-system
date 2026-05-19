<!--
 * @FilePath: /vue3-template-project/src/components/core/layout/menu/menu.vue
 * @Description: 文件描述...
-->
<template>
  <div class="layout-menu">
    <a-menu
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
  </div>
</template>
<script lang="ts" setup>
  import { computed, onBeforeMount, reactive, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MenuItem from './menu-item.vue';
  import { useMenuStore } from '@/store/modules/menu';

  interface Props {
    collapsed: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const route = useRoute();
  const router = useRouter();
  const menuStore = useMenuStore();

  const state = reactive({
    openKeys: [] as string[],
    selectedKeys: [] as string[]
  });

  const menus = computed(() => menuStore.showMenuListGet);

  // 点击菜单
  const clickMenuItem = ({ key }) => {
    router.push({ path: key });
  };

  // 监听路由菜单的变化
  const setMenuKey = () => {
    route.matched.forEach(item => {
      state.openKeys = [item.path as string];
    });
    // if (['/tableSpace/detail'].includes(route.path)) {
    //   state.selectedKeys = ['/tableSpace'];
    //   return;
    // }
    state.selectedKeys = [route.path as string];
  };

  onBeforeMount(setMenuKey);
  watch(route, setMenuKey);
</script>
<style lang="scss" scoped>
  // .layout-menu {}
</style>

/*
 * @FilePath: /vue3-template-project/src/store/modules/menu.ts
 * @Description: 菜单store
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AppRouteRecordRaw } from 'vue-router';
import { asyncRoutes } from '@/router/routes/asyncRoutes';
import { generateRouter, getShowMenuList } from '@/utils/router';

export const useMenuStore = defineStore('menuStore', () => {
  const menusList = ref<AppRouteRecordRaw[]>([]);

  const showMenuListGet = computed(() => getShowMenuList(menusList.value));

  const getMenus = async () => {
    menusList.value = await generateRouter(asyncRoutes);
    return menusList.value;
  };

  return {
    menusList,
    showMenuListGet,
    getMenus
  };
});

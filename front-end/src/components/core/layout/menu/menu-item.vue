<!--
 * @FilePath: /map-project-web/src/components/core/layout/menu/menu-item.vue
 * @Description: 文件描述...
-->
<template>
  <template
    v-for="item in menus"
    :key="item.path"
  >
    <!-- 目录 -->
    <template v-if="item.children && item.children.length">
      <a-sub-menu :key="item.path">
        <template #icon>
          <!-- <component :is="item.meta.icon"></component> -->
          <!-- <IconFont :type="item.meta.icon" /> -->
          <SvgIcon :icon="item.meta.icon" />
        </template>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
        <template #default>
          <!-- 递归生成菜单 -->
          <menu-item :menus="item.children" />
        </template>
      </a-sub-menu>
    </template>
    <!-- 菜单 -->
    <template v-else>
      <a-menu-item :key="item.path">
        <template #icon>
          <!-- <component :is="item.meta.icon"></component> -->
          <SvgIcon :icon="item.meta.icon" />
        </template>
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
    </template>
  </template>
</template>

<script lang="ts" setup name="MenuItem">
  import { type PropType } from 'vue';
  import { MenuOptions } from '@/types/interface/menu';

  const props = defineProps({
    menus: { type: Array as PropType<MenuOptions[]>, require: true, default: () => [] },
    collapsed: { type: Boolean, default: true }
  });
</script>

<style scoped lang="scss"></style>

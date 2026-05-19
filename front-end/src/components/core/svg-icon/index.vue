<!--
 * @FilePath: /map-project-web/src/components/core/svg-icon/index.vue
 * @Description: iconify 图标库组件 地址：https://icon-sets.iconify.design/
-->
<template>
  <Icon
    :icon="icon"
    v-bind="$attrs"
    class="svg-icon"
  />
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue';
  // import { computed, useAttrs } from 'vue';

  defineOptions({ name: 'SvgIcon', inheritAttrs: false });

  interface Props {
    icon: string;
  }

  const props = withDefaults(defineProps<Props>(), {});

  // const attrs = useAttrs();

  // const bindAttrs = computed<{ style: string }>(() => ({
  //   style: (attrs.style as string) || ''
  // }));
</script>

<style lang="scss" scoped>
  .svg-icon {
    display: inline-block;
    font-size: inherit;
    color: inherit;
    vertical-align: middle;
  }
</style>

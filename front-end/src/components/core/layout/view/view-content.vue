<template>
  <div class="view-content">
    <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveName">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </keep-alive>
    </router-view>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useKeepAliveStore } from '@/store/modules/keepAlive';

  // router
  const route = useRoute();
  // store
  const keepAliveStore = useKeepAliveStore();
  // 缓存的路由组件列表
  const keepAliveName = computed(() => keepAliveStore.keepAliveName);
</script>

<style lang="scss" scoped>
  .view-content {
    height: calc(100vh - 55px);
    // height: 100vh;
    overflow: auto;
  }
</style>

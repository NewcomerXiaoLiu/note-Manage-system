<!--
 * @FilePath: /vue3-template-project/src/views/result/403.vue
 * @Description: 403
-->
<template>
  <div class="page-container">
    <div class="card">
      <a-result
        status="403"
        title="403"
        sub-title="抱歉，您无权访问此页面。"
      >
        <template #extra>
          <a-button
            type="primary"
            @click="goHome"
          >
            返回首页
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { HOME_URL } from '@/config';

  const router = useRouter();

  const goHome = () => {
    router.replace(HOME_URL);
  };
</script>

<style lang="scss" scoped></style>

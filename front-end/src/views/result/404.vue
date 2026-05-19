<!--
 * @FilePath: /vue3-template-project/src/views/result/404.vue
 * @Description: 404错误页面
-->
<template>
  <div class="page-container">
    <div class="card">
      <a-result
        status="404"
        title="404"
        sub-title="抱歉，您访问的页面不存在。"
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

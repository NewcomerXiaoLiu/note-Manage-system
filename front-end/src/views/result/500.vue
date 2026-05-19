<!--
 * @FilePath: /vue3-template-project/src/views/result/500.vue
 * @Description: 500
-->
<template>
  <div class="page-container">
    <div class="card">
      <a-result
        status="500"
        title="500"
        sub-title="对不起，服务器出错。"
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

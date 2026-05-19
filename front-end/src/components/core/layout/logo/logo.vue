<template>
  <div class="logo">
    <div class="logo-icon">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="4" width="24" height="20" rx="3" />
        <path d="M8 10h12M8 15h8M8 20h10" stroke-linecap="round" />
      </svg>
    </div>
    <div
      v-if="!collapsed"
      class="logo-text"
      @click="router.push('/home')"
    >
      <span class="logo-title">{{ VITE_LOGO_TITLE }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const { VITE_LOGO_TITLE } = import.meta.env;

  interface Props {
    collapsed: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const router = useRouter();
</script>

<style lang="scss" scoped>
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 20px;
    user-select: none;

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: var(--color-primary);
      background: var(--color-primary-light);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .logo-text {
      cursor: pointer;

      .logo-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--color-text-primary);
        letter-spacing: -0.01em;
      }
    }
  }
</style>

<template>
  <div class="layout__header">
    <div class="header__left">
      <span class="trigger" @click="handleColl">
        <menu-unfold-outlined v-if="collapsed" />
        <menu-fold-outlined v-else />
      </span>
    </div>
    <a-flex
      class="header__right"
      gap="middle"
      align="center"
    >
      <Avatar />
    </a-flex>
  </div>
</template>

<script lang="ts" setup>
  import Avatar from './components/avatar.vue';

  interface Props {
    collapsed: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {});
  const emits = defineEmits(['update:collapsed']);

  const handleColl = () => {
    emits('update:collapsed', !props.collapsed);
  };
</script>

<style lang="scss" scoped>
  .layout__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;

    .header__left {
      .trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 16px;
        color: var(--color-text-secondary);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          color: var(--color-primary);
          background: var(--color-primary-light);
        }
      }
    }
  }
</style>

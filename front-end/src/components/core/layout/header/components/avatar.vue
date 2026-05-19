<template>
  <div>
    <a-dropdown placement="bottomRight" :trigger="['hover']">
      <a @click.prevent>
        <a-flex gap="small" align="center" class="user-info">
          <a-avatar class="user-avatar">{{ userStore?.info?.name?.charAt(0) || 'T' }}</a-avatar>
          <span class="user-name">{{ userStore?.info?.name || 'test' }}</span>
          <DownOutlined class="user-arrow" />
        </a-flex>
      </a>
      <template #overlay>
        <a-menu @click="onClick">
          <a-menu-item key="logout">退出登录</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  import { createVNode } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';

  const router = useRouter();
  const userStore = useUserStore();

  const onClick = ({ key }) => {
    switch (key) {
      case 'logout':
        Modal.confirm({
          title: '退出确认',
          icon: createVNode(ExclamationCircleOutlined),
          content: '确定要退出登录吗？',
          okText: '确认退出',
          cancelText: '取消',
          onOk: () => {
            message.success('已退出登录');
            userStore.logOut();
          }
        });
        break;
      default:
        return;
    }
  };
</script>

<style scoped>
  .user-info {
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;
  }

  .user-info:hover {
    background: var(--color-primary-light);
  }

  .user-avatar {
    background: var(--color-primary) !important;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    border: none;
  }

  .user-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .user-arrow {
    font-size: 10px;
    color: var(--color-text-muted);
  }
</style>

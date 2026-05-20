<template>
  <div class="sidebar-groups">
    <div class="groups-header">
      <span class="groups-title">笔记分类</span>
    </div>
    <div class="groups-body">
      <div
        class="group-item"
        :class="{ active: selectedId === undefined }"
        @click="selectGroup(undefined)"
      >
        <span class="group-name">全部笔记</span>
        <span class="group-count">{{ totalCount }}</span>
      </div>
      <div
        v-for="group in groups"
        :key="group.id"
        class="group-item"
        :class="{ active: selectedId === group.id }"
        @click="selectGroup(group.id)"
      >
        <span class="group-name">{{ group.name }}</span>
        <span class="group-count">{{ group._count || 0 }}</span>
      </div>
      <div v-if="loading" class="groups-loading">加载中...</div>
      <div v-if="!loading && groups.length === 0" class="groups-empty">暂无分组</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import to from 'await-to-js';
  import { onMounted, ref } from 'vue';
  import { groupsApi } from '@/api/modules/groups';

  const emit = defineEmits<{ select: [groupId: string | undefined] }>();

  const loading = ref(false);
  const groups = ref<any[]>([]);
  const selectedId = ref<string | undefined>(undefined);
  const totalCount = ref(0);

  const selectGroup = (id: string | undefined) => {
    selectedId.value = id;
    emit('select', id);
  };

  const fetchGroups = async () => {
    loading.value = true;
    const [err, res] = await to(groupsApi.list());
    loading.value = false;
    if (err) return;
    groups.value = res || [];
    totalCount.value = (res || []).reduce((sum: number, g: any) => sum + (g._count || 0), 0);
  };

  onMounted(fetchGroups);
</script>

<style scoped lang="scss">
  .sidebar-groups {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .groups-header {
      padding: 12px 12px 8px;
      flex-shrink: 0;

      .groups-title {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
    }

    .groups-body {
      flex: 1;
      overflow-y: auto;
      padding: 0 8px 12px;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

      .group-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        margin-bottom: 2px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: var(--color-bg-page);
        }

        &.active {
          background: var(--color-primary-light);
          .group-name { color: var(--color-primary); font-weight: 600; }
          .group-count { color: var(--color-primary); }
        }

        .group-name {
          font-size: 14px;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .group-count {
          font-size: 11px;
          color: var(--color-text-muted);
          background: var(--color-bg-page);
          padding: 0 6px;
          border-radius: 8px;
          line-height: 18px;
          margin-left: 8px;
          flex-shrink: 0;
        }
      }

      .groups-loading, .groups-empty {
        text-align: center;
        padding: 24px 12px;
        font-size: 13px;
        color: var(--color-text-muted);
      }
    }
  }
</style>

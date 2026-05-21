<template>
  <div class="sidebar-groups">
    <div class="groups-header">
      <span class="groups-title">笔记分类</span>
    </div>
    <div class="groups-body">
      <!-- 全部笔记 -->
      <div
        class="group-item"
        :class="{ active: selectedId === undefined }"
        @click="selectGroup(undefined)"
      >
        <span class="group-name">全部笔记</span>
        <span class="group-count">{{ totalCount }}</span>
      </div>

      <!-- 分组树 -->
      <div
        v-for="{ node, depth } in flattenedTree"
        :key="node.id"
        class="group-item"
        :class="{ active: selectedId === node.id }"
        :style="{ paddingLeft: 12 + depth * 18 + 'px' }"
        @click="selectGroup(node.id)"
      >
        <span
          v-if="node.children.length"
          class="expand-icon"
          @click.stop="toggleExpand(node.id)"
        >
          <CaretRightOutlined v-if="!expandedIds.has(node.id)" />
          <CaretDownOutlined v-else />
        </span>
        <span
          v-else
          class="expand-placeholder"
        />
        <span class="group-name">{{ node.name }}</span>
        <span class="group-count">{{ node.note_count ?? 0 }}</span>
      </div>

      <!-- 未分组 -->
      <div
        class="group-item"
        :class="{ active: selectedId === '__ungrouped' }"
        @click="selectGroup('__ungrouped')"
      >
        <span class="expand-placeholder" />
        <span class="group-name">未分组</span>
      </div>

      <div
        v-if="loading"
        class="groups-loading"
      >
        加载中...
      </div>
      <div
        v-if="!loading && groups.length === 0"
        class="groups-empty"
      >
        暂无分组
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
  import to from 'await-to-js';
  import { computed, onMounted, ref } from 'vue';
  import { groupsApi } from '@/api/modules/groups';

  const emit = defineEmits<{ select: [groupId: string | undefined] }>();

  const loading = ref(false);
  const groups = ref<any[]>([]);
  const selectedId = ref<string | undefined>(undefined);
  const totalCount = ref(0);
  const expandedIds = ref(new Set<string>());

  const selectGroup = (id: string | undefined) => {
    selectedId.value = id;
    emit('select', id);
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expandedIds.value = next;
  };

  // 从平铺列表按 parent_id 构建树
  const groupTree = computed(() => {
    const map = new Map<string, any>();
    const roots: any[] = [];

    groups.value.forEach((g: any) => map.set(g.id, { ...g, children: [] }));

    groups.value.forEach((g: any) => {
      const node = map.get(g.id);
      if (g.parent_id && map.has(g.parent_id)) {
        map.get(g.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });

    const sortFn = (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
    const sortTree = (nodes: any[]) => {
      nodes.sort(sortFn);
      nodes.forEach(n => sortTree(n.children));
    };
    sortTree(roots);

    return roots;
  });

  // 展平为带 depth 的列表，用于渲染
  const flattenedTree = computed(() => {
    const result: Array<{ node: any; depth: number }> = [];
    const walk = (nodes: any[], depth: number) => {
      nodes.forEach(node => {
        result.push({ node, depth });
        if (node.children.length && expandedIds.value.has(node.id)) {
          walk(node.children, depth + 1);
        }
      });
    };
    walk(groupTree.value, 0);
    return result;
  });

  const fetchGroups = async () => {
    loading.value = true;
    const [err, res] = await to(groupsApi.list());
    loading.value = false;
    if (err) return;
    groups.value = res || [];
    totalCount.value = (res || []).reduce((sum: number, g: any) => sum + (g.note_count || 0), 0);
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

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 2px;
      }

      .group-item {
        display: flex;
        align-items: center;
        padding: 7px 12px;
        margin-bottom: 2px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: var(--color-bg-page);
        }

        &.active {
          background: var(--color-primary-light);
          .group-name {
            color: var(--color-primary);
            font-weight: 600;
          }
          .group-count {
            color: var(--color-primary);
          }
        }

        .expand-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          margin-right: 2px;
          font-size: 10px;
          color: var(--color-text-muted);
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s;

          &:hover {
            background: var(--color-border-light);
          }
        }

        .expand-placeholder {
          width: 18px;
          flex-shrink: 0;
        }

        .group-name {
          font-size: 14px;
          color: var(--color-text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          margin-left: 4px;
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

      .groups-loading,
      .groups-empty {
        text-align: center;
        padding: 24px 12px;
        font-size: 13px;
        color: var(--color-text-muted);
      }
    }
  }
</style>

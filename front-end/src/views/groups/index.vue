<template>
  <div class="page-container">
    <div class="groups-header">
      <div>
        <div class="page-title">笔记分组</div>
        <div class="page-subtitle">管理笔记的分类结构</div>
      </div>
      <a-button
        type="primary"
        @click="handleAdd"
      >
        <PlusOutlined />
        新增分组
      </a-button>
    </div>

    <div class="groups-card">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <span :style="{ paddingLeft: record._depth * 24 + 'px' }">{{ record.name }}</span>
          </template>
          <template v-if="column.dataIndex === 'created_at'">
            {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm') }}
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-space size="middle">
              <a
                class="action-link"
                @click="handleEdit(record)"
              >
                编辑
              </a>
              <a-popconfirm
                title="确定删除此分组？"
                description="分组下的笔记也会一并删除"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a class="action-link danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:open="modalOpen"
      :title="editingGroup ? '编辑分组' : '新增分组'"
      :confirm-loading="submitting"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        layout="vertical"
        :model="form"
      >
        <a-form-item
          label="分组名称"
          name="name"
          :rules="[{ required: true, message: '请输入分组名称' }]"
        >
          <a-input
            v-model:value="form.name"
            placeholder="请输入分组名称"
          />
        </a-form-item>
        <a-form-item
          label="所属父级分组"
          name="parentId"
        >
          <a-tree-select
            v-model:value="form.parentId"
            :tree-data="parentTreeOptions"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="无（顶级分组）"
            allow-clear
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          label="排序序号"
          name="sortOrder"
        >
          <a-input-number
            v-model:value="form.sortOrder"
            :min="0"
            style="width: 100%"
            placeholder="数字越小越靠前"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { type FormInstance, message } from 'ant-design-vue';
  import to from 'await-to-js';
  import dayjs from 'dayjs';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { groupsApi } from '@/api/modules/groups';

  interface Group {
    id: string;
    name: string;
    parent_id: string | null;
    sort_order: number;
    note_count: number;
    created_at: string;
    updated_at: string;
  }

  const loading = ref(false);
  const submitting = ref(false);
  const groups = ref<Group[]>([]);
  const modalOpen = ref(false);
  const editingGroup = ref<Group | null>(null);
  const formRef = ref<FormInstance>();
  const form = reactive({ name: '', parentId: undefined as string | undefined, sortOrder: 0 });

  const columns = [
    { title: '名称', dataIndex: 'name', width: 200 },
    { title: '排序', dataIndex: 'sort_order', width: 80 },
    { title: '笔记数', dataIndex: 'note_count', width: 80 },
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
    { title: '操作', dataIndex: 'actions', width: 130 }
  ];

  // 从平铺列表构建树
  const treeData = computed(() => {
    const map = new Map<string, any>();
    const roots: any[] = [];
    groups.value.forEach(g => map.set(g.id, { ...g, children: [] }));
    groups.value.forEach(g => {
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

  // 展平为带 depth 的表格数据
  const tableData = computed(() => {
    const result: any[] = [];
    const walk = (nodes: any[], depth: number) => {
      nodes.forEach(n => {
        result.push({ ...n, _depth: depth });
        walk(n.children, depth + 1);
      });
    };
    walk(treeData.value, 0);
    return result;
  });

  // 树形选择器数据（编辑时过滤掉自身及子节点，防循环引用）
  const parentTreeOptions = computed(() => {
    if (!editingGroup.value) return treeData.value;
    const excludeId = editingGroup.value.id;
    const filterNode = (nodes: any[]): any[] => {
      return nodes
        .filter(n => n.id !== excludeId)
        .map(n => ({
          ...n,
          children: filterNode(n.children)
        }));
    };
    return filterNode(treeData.value);
  });

  const fetchGroups = async () => {
    loading.value = true;
    const [err, res] = await to(groupsApi.list());
    loading.value = false;
    if (err) return;
    groups.value = res;
  };

  const handleAdd = () => {
    editingGroup.value = null;
    form.name = '';
    form.parentId = undefined;
    form.sortOrder = 0;
    modalOpen.value = true;
  };

  const handleEdit = (group: Group) => {
    editingGroup.value = group;
    form.name = group.name;
    form.parentId = group.parent_id ?? undefined;
    form.sortOrder = group.sort_order;
    modalOpen.value = true;
  };

  const handleSubmit = async () => {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    submitting.value = true;
    const payload = { ...form };
    const [err] = editingGroup.value
      ? await to(groupsApi.update(editingGroup.value.id, payload))
      : await to(groupsApi.create(payload));
    submitting.value = false;
    if (err) return;
    message.success(editingGroup.value ? '编辑成功' : '创建成功');
    modalOpen.value = false;
    fetchGroups();
  };

  const handleDelete = async (id: string) => {
    const [err] = await to(groupsApi.remove(id));
    if (err) return;
    message.success('删除成功');
    fetchGroups();
  };

  onMounted(fetchGroups);
</script>

<style scoped lang="scss">
  .groups-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .groups-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 4px;
  }

  .action-link {
    font-size: 13px;
    color: var(--color-primary);

    &:hover {
      opacity: 0.8;
    }

    &.danger {
      color: var(--color-error);

      &:hover {
        opacity: 0.8;
      }
    }
  }
</style>

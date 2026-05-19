<template>
  <div class="page-container">
    <div class="groups-header">
      <div>
        <div class="page-title">笔记分组</div>
        <div class="page-subtitle">管理笔记的分类结构</div>
      </div>
      <a-button type="primary" @click="handleAdd">
        <PlusOutlined />
        新增分组
      </a-button>
    </div>

    <div class="groups-card">
      <a-table
        :columns="columns"
        :data-source="groups"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'created_at'">
            {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm') }}
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-space size="middle">
              <a class="action-link" @click="handleEdit(record)">编辑</a>
              <a-popconfirm title="确定删除此分组？" description="分组下的笔记也会一并删除" @confirm="handleDelete(record.id)" ok-text="删除" cancel-text="取消">
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
      @ok="handleSubmit"
      :confirm-loading="submitting"
      ok-text="确认"
      cancel-text="取消"
    >
      <a-form layout="vertical" :model="form" ref="formRef">
        <a-form-item label="分组名称" name="name" :rules="[{ required: true, message: '请输入分组名称' }]">
          <a-input v-model:value="form.name" placeholder="请输入分组名称" />
        </a-form-item>
        <a-form-item label="排序序号" name="sortOrder">
          <a-input-number v-model:value="form.sortOrder" :min="0" style="width: 100%" placeholder="数字越小越靠前" />
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
  import { onMounted, reactive, ref } from 'vue';
  import { groupsApi } from '@/api/modules/groups';

  interface Group { id: string; name: string; sort_order: number; note_count: number; created_at: string; updated_at: string; }

  const loading = ref(false);
  const submitting = ref(false);
  const groups = ref<Group[]>([]);
  const modalOpen = ref(false);
  const editingGroup = ref<Group | null>(null);
  const formRef = ref<FormInstance>();
  const form = reactive({ name: '', sortOrder: 0 });

  const columns = [
    { title: '名称', dataIndex: 'name', width: 200 },
    { title: '排序', dataIndex: 'sort_order', width: 80 },
    { title: '笔记数', dataIndex: 'note_count', width: 80 },
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
    { title: '操作', dataIndex: 'actions', width: 130 },
  ];

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
    form.sortOrder = 0;
    modalOpen.value = true;
  };

  const handleEdit = (group: Group) => {
    editingGroup.value = group;
    form.name = group.name;
    form.sortOrder = group.sort_order;
    modalOpen.value = true;
  };

  const handleSubmit = async () => {
    try { await formRef.value?.validate(); } catch { return; }
    submitting.value = true;
    const [err] = editingGroup.value
      ? await to(groupsApi.update(editingGroup.value.id, form))
      : await to(groupsApi.create(form));
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

    &:hover { opacity: 0.8; }

    &.danger {
      color: var(--color-error);

      &:hover { opacity: 0.8; }
    }
  }
</style>

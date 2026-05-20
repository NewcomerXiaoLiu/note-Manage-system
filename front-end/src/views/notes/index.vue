<template>
  <div class="page-container notes-page">
    <a-row :gutter="16" style="height: 100%">
      <!-- 左侧列表 -->
      <a-col :span="9">
        <div class="panel list-panel">
          <div class="panel-header">
            <div class="panel-header-left">
              <h3>全部笔记</h3>
              <span class="count-badge">{{ notes.length }}</span>
            </div>
            <a-space>
              <a-select
                v-model:value="filterGroupId"
                placeholder="分组筛选"
                allow-clear
                style="width: 120px"
                @change="fetchNotes"
              />
              <a-button type="primary" ghost @click="handleAdd">
                <PlusOutlined />
                新建
              </a-button>
            </a-space>
          </div>

          <div class="panel-body" :style="{ maxHeight: listMaxHeight + 'px' }">
            <div
              v-for="note in notes"
              :key="note.id"
              class="note-item"
              :class="{ active: selectedNote?.id === note.id }"
              @click="selectNote(note)"
            >
              <div class="note-item-title">{{ note.title || '无标题' }}</div>
              <div class="note-item-meta">
                <span>{{ note.group_name }}</span>
                <span>{{ dayjs(note.created_at).format('MM-DD HH:mm') }}</span>
              </div>
            </div>
            <a-empty v-if="!loading && notes.length === 0" description="暂无笔记" class="empty-state" />
          </div>
        </div>
      </a-col>

      <!-- 右侧详情 -->
      <a-col :span="15">
        <div class="panel detail-panel" v-if="selectedNote">
          <div class="detail-header">
            <h2 class="detail-title">{{ selectedNote.title }}</h2>
            <div class="detail-meta">
              <span>{{ selectedNote.group_name }}</span>
              <span>·</span>
              <span>创建 {{ dayjs(selectedNote.created_at).format('YYYY-MM-DD HH:mm') }}</span>
              <span v-if="selectedNote.updated_at !== selectedNote.created_at">·</span>
              <span v-if="selectedNote.updated_at !== selectedNote.created_at">更新 {{ dayjs(selectedNote.updated_at).format('YYYY-MM-DD HH:mm') }}</span>
            </div>
            <div class="detail-actions">
              <a-button @click="handleEdit(selectedNote)">
                <EditOutlined />
                编辑
              </a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(selectedNote.id)" ok-text="删除" cancel-text="取消">
                <a-button danger>
                  <DeleteOutlined />
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-body">
            <div v-if="selectedNote.content" class="detail-content" v-html="selectedNote.content"></div>
            <div v-else class="detail-empty-content">暂无内容</div>
          </div>
        </div>

        <div class="panel detail-panel detail-empty" v-else>
          <div class="empty-state-large">
            <FileSearchOutlined />
            <p>选择一篇笔记查看详情</p>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
  import { DeleteOutlined, EditOutlined, FileSearchOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import to from 'await-to-js';
  import dayjs from 'dayjs';
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { groupsApi } from '@/api/modules/groups';
  import { notesApi } from '@/api/modules/notes';

  interface Note {
    id: string;
    group_id: string;
    group_name: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  }

  interface Group { id: string; name: string; }

  const router = useRouter();
  const loading = ref(false);
  const notes = ref<Note[]>([]);
  const groups = ref<Group[]>([]);
  const filterGroupId = ref<string | undefined>(undefined);
  const selectedNote = ref<Note | null>(null);
  const listMaxHeight = ref(600);

  const updateHeight = () => { listMaxHeight.value = window.innerHeight - 300; };

  const fetchGroups = async () => {
    const [err, res] = await to(groupsApi.list());
    if (!err) groups.value = res || [];
  };

  const fetchNotes = async () => {
    loading.value = true;
    const [err, res] = await to(notesApi.list(filterGroupId.value));
    loading.value = false;
    if (err) return;
    notes.value = res || [];
    if (selectedNote.value) {
      const stillExist = notes.value.find(n => n.id === selectedNote.value!.id);
      if (!stillExist) selectedNote.value = null;
    }
  };

  const selectNote = (note: Note) => { selectedNote.value = note; };
  const handleAdd = () => { router.push('/notes/edit'); };
  const handleEdit = (note: Note) => { router.push(`/notes/edit/${note.id}`); };

  const handleDelete = async (id: string) => {
    const [err] = await to(notesApi.remove(id));
    if (err) return;
    message.success('删除成功');
    if (selectedNote.value?.id === id) selectedNote.value = null;
    fetchNotes();
  };

  onMounted(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);
    fetchGroups();
    fetchNotes();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
  });
</script>

<style scoped lang="scss">
  .notes-page {
    padding: 16px;
    height: 100%;

    :deep(.ant-row) { height: 100%; }

    .panel {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
  }

  // 左面板
  .list-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border-light);
      flex-shrink: 0;

      .panel-header-left {
        display: flex;
        align-items: center;
        gap: 8px;

        h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .count-badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--color-text-muted);
          background: var(--color-bg-page);
          padding: 0 6px;
          border-radius: 8px;
          line-height: 18px;
        }
      }
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 4px;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

      .note-item {
        padding: 12px 16px;
        cursor: pointer;
        border-radius: 6px;
        margin-bottom: 2px;
        transition: all 0.15s;

        &:hover {
          background: var(--color-bg-page);
        }

        &.active {
          background: var(--color-primary-light);

          .note-item-title {
            color: var(--color-primary);
          }
        }

        .note-item-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary);
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .note-item-meta {
          font-size: 12px;
          color: var(--color-text-muted);
          display: flex;
          justify-content: space-between;
        }
      }

      .empty-state { margin-top: 48px; }
    }
  }

  // 右面板
  .detail-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: 24px 28px;

    .detail-header {
      flex-shrink: 0;

      .detail-title {
        font-size: 20px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 8px;
        letter-spacing: -0.01em;
      }

      .detail-meta {
        font-size: 12px;
        color: var(--color-text-muted);
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 16px;
      }

      .detail-actions {
        display: flex;
        gap: 8px;
      }
    }

    .detail-divider {
      height: 1px;
      background: var(--color-border-light);
      margin: 16px -28px;
      flex-shrink: 0;
    }

    .detail-body {
      flex: 1;
      overflow-y: auto;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

      .detail-content {
        font-size: 15px;
        line-height: 1.8;
        color: var(--color-text-primary);

        :deep(img) { max-width: 100%; border-radius: 6px; margin: 12px 0; }
        :deep(blockquote) {
          margin: 12px 0;
          padding: 10px 16px;
          border-left: 3px solid var(--color-primary);
          background: var(--color-primary-light);
          border-radius: 0 4px 4px 0;
        }
        :deep(pre) {
          background: var(--color-bg-page);
          border: 1px solid var(--color-border-light);
          border-radius: 6px;
          padding: 14px;
          font-size: 13px;
        }
      }

      .detail-empty-content {
        color: var(--color-text-muted);
        font-size: 14px;
      }
    }
  }

  .detail-empty {
    display: flex;
    align-items: center;
    justify-content: center;

    .empty-state-large {
      text-align: center;
      color: var(--color-text-muted);

      .anticon {
        font-size: 40px;
        margin-bottom: 12px;
        opacity: 0.3;
      }

      p {
        font-size: 14px;
        margin: 0;
      }
    }
  }
</style>

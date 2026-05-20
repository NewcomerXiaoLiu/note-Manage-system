<template>
  <div class="notes-content">
    <!-- 顶部标题栏 -->
    <div class="content-header">
      <div class="content-header-left">
        <h2 class="content-title">笔记</h2>
      </div>
      <div class="content-header-right">
        <a-button type="primary" @click="handleAdd">
          <plus-outlined />
          新建笔记
        </a-button>
      </div>
    </div>

    <!-- 主体两栏 -->
    <div class="content-body">
      <!-- 笔记列表 -->
      <div class="notes-list">
        <div
          v-for="note in filteredNotes"
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
        <div v-if="!loading && filteredNotes.length === 0" class="empty-notes">暂无笔记</div>
      </div>

      <!-- 笔记详情 -->
      <div class="note-detail">
        <template v-if="selectedNote">
          <div class="detail-header">
            <h3 class="detail-title">{{ selectedNote.title }}</h3>
            <div class="detail-meta">
              <span>{{ selectedNote.group_name }}</span>
              <span>·</span>
              <span>创建 {{ dayjs(selectedNote.created_at).format('YYYY-MM-DD HH:mm') }}</span>
              <span v-if="selectedNote.updated_at !== selectedNote.created_at">·</span>
              <span v-if="selectedNote.updated_at !== selectedNote.created_at">更新 {{ dayjs(selectedNote.updated_at).format('YYYY-MM-DD HH:mm') }}</span>
            </div>
            <div class="detail-actions">
              <a-button size="small" @click="handleEdit(selectedNote)">
                <edit-outlined />
                编辑
              </a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(selectedNote.id)" ok-text="删除" cancel-text="取消">
                <a-button size="small" danger>
                  <delete-outlined />
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-body">
            <div v-if="selectedNote.content" class="detail-content" v-html="selectedNote.content"></div>
            <div v-else class="empty-content">暂无内容</div>
          </div>
        </template>
        <div v-else class="detail-empty">
          <file-search-outlined />
          <p>选择一篇笔记查看详情</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DeleteOutlined, EditOutlined, FileSearchOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import to from 'await-to-js';
  import dayjs from 'dayjs';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
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

  const props = withDefaults(defineProps<{ selectedGroupId?: string }>(), {});

  const router = useRouter();
  const loading = ref(false);
  const allNotes = ref<Note[]>([]);
  const selectedNote = ref<Note | null>(null);

  const filteredNotes = computed(() => {
    if (!props.selectedGroupId) return allNotes.value;
    return allNotes.value.filter(n => n.group_id === props.selectedGroupId);
  });

  const fetchNotes = async () => {
    loading.value = true;
    const [err, res] = await to(notesApi.list());
    loading.value = false;
    if (err) return;
    allNotes.value = res || [];
    if (selectedNote.value) {
      const stillExist = allNotes.value.find(n => n.id === selectedNote.value!.id);
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

  const updateListMaxHeight = () => { /* no-op, CSS handles it */ };

  watch(() => props.selectedGroupId, () => { selectedNote.value = null; });

  onMounted(() => {
    window.addEventListener('resize', updateListMaxHeight);
    fetchNotes();
  });
  onUnmounted(() => {
    window.removeEventListener('resize', updateListMaxHeight);
  });
</script>

<style scoped lang="scss">
  .notes-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 24px;
      background: var(--color-bg-header);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border-light);
      flex-shrink: 0;

      .content-header-left {
        .content-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }
      }
    }

    .content-body {
      flex: 1;
      display: flex;
      overflow: hidden;
      padding: 16px;
      gap: 16px;

      .notes-list {
        width: 280px;
        flex-shrink: 0;
        overflow-y: auto;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 4px;

        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }

        .note-item {
          padding: 12px 16px;
          cursor: pointer;
          border-radius: 6px;
          margin-bottom: 2px;
          transition: all 0.15s;

          &:hover { background: var(--color-bg-page); }

          &.active {
            background: var(--color-primary-light);
            .note-item-title { color: var(--color-primary); }
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

        .empty-notes {
          text-align: center;
          padding: 48px 16px;
          color: var(--color-text-muted);
          font-size: 13px;
        }
      }

      .note-detail {
        flex: 1;
        overflow: hidden;
        background: var(--color-bg-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 20px 24px;
        display: flex;
        flex-direction: column;

        .detail-header {
          flex-shrink: 0;

          .detail-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-text-primary);
            margin-bottom: 6px;
            letter-spacing: -0.01em;
          }

          .detail-meta {
            font-size: 12px;
            color: var(--color-text-muted);
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 14px;
          }

          .detail-actions {
            display: flex;
            gap: 8px;
          }
        }

        .detail-divider {
          height: 1px;
          background: var(--color-border-light);
          margin: 14px -24px;
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

          .empty-content {
            color: var(--color-text-muted);
            font-size: 14px;
          }
        }

        .detail-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);

          .anticon {
            font-size: 40px;
            margin-bottom: 12px;
            opacity: 0.3;
          }

          p { font-size: 14px; margin: 0; }
        }
      }
    }
  }
</style>

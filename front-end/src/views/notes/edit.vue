<template>
  <div class="page-container edit-page">
    <div class="edit-nav">
      <a @click="goBack" class="back-link">
        <LeftOutlined />
        返回
      </a>
      <span class="edit-nav-title">{{ isEdit ? '编辑笔记' : '新建笔记' }}</span>
    </div>

    <div class="edit-card">
      <a-form layout="vertical" :model="form" ref="formRef">
        <a-row :gutter="20">
          <a-col :span="7">
            <a-form-item label="所属分组" name="groupId" :rules="[{ required: true, message: '请选择分组' }]">
              <a-select v-model:value="form.groupId" placeholder="请选择分组">
                <a-select-option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="17">
            <a-form-item label="笔记标题" name="title" :rules="[{ required: true, message: '请输入笔记标题' }]">
              <a-input v-model:value="form.title" placeholder="输入笔记标题..." />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="笔记内容">
          <div class="editor-wrapper">
            <div id="toolbar-container" class="editor-toolbar"></div>
            <div id="editor-container" class="editor-body"></div>
          </div>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">
              <SaveOutlined />
              {{ isEdit ? '保存修改' : '创建笔记' }}
            </a-button>
            <a-button @click="goBack">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { LeftOutlined, SaveOutlined } from '@ant-design/icons-vue';
  import { type FormInstance, message } from 'ant-design-vue';
  import to from 'await-to-js';
  import { createEditor, createToolbar, type IDomEditor } from '@wangeditor/editor';
  import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { groupsApi } from '@/api/modules/groups';
  import { notesApi } from '@/api/modules/notes';
  import '@wangeditor/editor/dist/css/style.css';

  const route = useRoute();
  const router = useRouter();
  const formRef = ref<FormInstance>();
  const isEdit = ref(false);
  const submitting = ref(false);
  const groups = ref<any[]>([]);
  const noteId = route.params.id as string;
  let editor: IDomEditor | null = null;

  const form = reactive({ groupId: '', title: '', content: '' });

  const goBack = () => { router.push('/notes'); };

  const fetchGroups = async () => {
    const [err, res] = await to(groupsApi.list());
    if (!err) groups.value = res || [];
  };

  const loadNote = async (id: string) => {
    const [err, res] = await to(notesApi.detail(id));
    if (err) return;
    form.groupId = res.group_id;
    form.title = res.title;
    form.content = res.content || '';
    nextTick(() => { if (editor) editor.setHtml(form.content); });
  };

  const initEditor = () => {
    editor = createEditor({
      selector: '#editor-container',
      mode: 'default',
      config: {
        placeholder: '开始书写...',
        onChange: () => { if (editor) form.content = editor.getHtml(); },
      },
    });
    createToolbar({ editor, mode: 'default', selector: '#toolbar-container' });
    if (isEdit.value) {
      nextTick(() => { if (editor) editor.setHtml(form.content); });
    }
  };

  const handleSubmit = async () => {
    try { await formRef.value?.validate(); } catch { return; }
    form.content = editor?.getHtml() || '';
    submitting.value = true;
    const [err] = isEdit.value
      ? await to(notesApi.update(noteId, form))
      : await to(notesApi.create(form));
    submitting.value = false;
    if (err) return;
    message.success(isEdit.value ? '保存成功' : '创建成功');
    goBack();
  };

  onMounted(async () => {
    await fetchGroups();
    if (noteId) {
      isEdit.value = true;
      await loadNote(noteId);
    } else {
      form.groupId = groups.value[0]?.id || '';
    }
    await nextTick();
    initEditor();
  });

  onBeforeUnmount(() => {
    if (editor) { editor.destroy(); editor = null; }
  });
</script>

<style scoped lang="scss">
  .edit-page {
    max-width: 960px;
    margin: 0 auto;
  }

  .edit-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--color-text-secondary);

      &:hover {
        color: var(--color-primary);
      }
    }

    .edit-nav-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text-primary);
      padding-left: 12px;
      border-left: 1px solid var(--color-border);
    }
  }

  .edit-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 24px;
  }

  // wangEditor 样式覆盖
  :deep(.editor-wrapper) {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;

    &:focus-within {
      border-color: var(--color-primary);
    }

    .editor-toolbar {
      border-bottom: 1px solid var(--color-border-light);
      background: var(--color-bg-page);
    }

    .editor-body {
      height: 480px;

      .w-e-text-container {
        .w-e-text {
          padding: 16px 20px;
        }
      }
    }
  }
</style>

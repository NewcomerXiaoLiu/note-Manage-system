<template>
  <div class="tdoc">
    <!-- 顶部操作栏 -->
    <div class="tdoc-topbar">
      <div class="tdoc-topbar-left">
        <a
          class="tdoc-back"
          @click="goBack"
        >
          <LeftOutlined />
          <span>返回</span>
        </a>
      </div>
      <div class="tdoc-topbar-right">
        <a-select
          v-model:value="form.groupId"
          class="tdoc-group-picker"
          size="small"
          placeholder="选择分组"
          :bordered="false"
        >
          <a-select-option
            v-for="g in groups"
            :key="g.id"
            :value="g.id"
          >
            {{ g.name }}
          </a-select-option>
        </a-select>
        <a-button
          type="primary"
          :loading="submitting"
          size="small"
          @click="handleSubmit"
        >
          <template #icon><SaveOutlined /></template>
          {{ isEdit ? '保存修改' : '创建笔记' }}
        </a-button>
      </div>
    </div>

    <!-- 文档编辑区 -->
    <div class="tdoc-body">
      <div class="tdoc-paper">
        <div class="tdoc-title-wrap">
          <input
            v-model="form.title"
            class="tdoc-title-input"
            placeholder="无标题"
            @keydown.enter.prevent="focusEditor"
          />
        </div>
        <div class="tdoc-editor-wrap">
          <div
            id="toolbar-container"
            class="tdoc-toolbar"
          />
          <div
            id="editor-container"
            class="tdoc-content"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { LeftOutlined, SaveOutlined } from '@ant-design/icons-vue';
  import { createEditor, createToolbar, type IDomEditor } from '@wangeditor/editor';
  import { message } from 'ant-design-vue';
  import to from 'await-to-js';
  import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { groupsApi } from '@/api/modules/groups';
  import { notesApi } from '@/api/modules/notes';
  import '@wangeditor/editor/dist/css/style.css';
  import '@wangeditor/code-highlight';
  import '@wangeditor/code-highlight/dist/css/style.css';

  const route = useRoute();
  const router = useRouter();
  const isEdit = ref(false);
  const submitting = ref(false);
  const groups = ref<any[]>([]);
  const noteId = route.params.id as string;
  let editor: IDomEditor | null = null;

  const form = reactive({ groupId: undefined as string | undefined, title: '', content: '' });

  const goBack = () => {
    router.push('/notes');
  };

  const focusEditor = () => {
    nextTick(() => editor?.focus());
  };

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
    nextTick(() => {
      if (editor) editor.setHtml(form.content);
    });
  };

  const initEditor = () => {
    const toolbarConfig = {
      toolbarKeys: [
        'headerSelect',
        'bold',
        'italic',
        'underline',
        'through',
        'color',
        'bgColor',
        'clearStyle',
        '|',
        'fontSize',
        'fontFamily',
        'lineHeight',
        '|',
        'bulletedList',
        'numberedList',
        'todo',
        '|',
        'indent',
        'delIndent',
        '|',
        'emotion',
        'insertLink',
        'insertTable',
        'codeBlock',
        '|',
        'undo',
        'redo',
        'fullScreen'
      ]
    };

    const editorConfig = {
      placeholder: '开始书写...',
      onChange: () => {
        if (editor) form.content = editor.getHtml();
      }
    };

    editor = createEditor({
      selector: '#editor-container',
      config: editorConfig,
      mode: 'default'
    });

    createToolbar({
      editor,
      selector: '#toolbar-container',
      config: toolbarConfig,
      mode: 'default'
    });

    if (isEdit.value) {
      nextTick(() => {
        if (editor) editor.setHtml(form.content);
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      message.warning('请输入笔记标题');
      return;
    }
    form.content = editor?.getHtml() || '';
    submitting.value = true;
    const [err] = isEdit.value ? await to(notesApi.update(noteId, form)) : await to(notesApi.create(form));
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
    }
    await nextTick();
    initEditor();
  });

  onBeforeUnmount(() => {
    if (editor) {
      editor.destroy();
      editor = null;
    }
  });
</script>

<style scoped lang="scss">
  .tdoc {
    max-width: 1000px;
    margin: 0 auto;
  }

  /* 顶部操作栏 */
  .tdoc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    margin-bottom: 16px;
    padding: 0 4px;
  }

  .tdoc-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--color-text-secondary);
    transition: color 0.2s;

    &:hover {
      color: var(--color-primary);
    }
  }

  .tdoc-topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tdoc-group-picker {
    min-width: 100px;
    color: var(--color-text-secondary);
    font-size: 13px;

    &:hover {
      color: var(--color-primary);
    }
  }

  /* 文档纸张 */
  .tdoc-body {
    display: flex;
    justify-content: center;
  }

  .tdoc-paper {
    width: 100%;
    max-width: 820px;
    background: #fff;
    border-radius: var(--radius-lg);
    box-shadow:
      0 1px 4px rgba(0, 0, 0, 0.08),
      0 2px 12px rgba(0, 0, 0, 0.04);
    padding: 48px 56px 64px;
    min-height: 600px;
  }

  /* 文档标题 */
  .tdoc-title-wrap {
    margin-bottom: 8px;
  }

  .tdoc-title-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.4;
    color: #1a1a1a;
    font-family: var(--font-heading);

    &::placeholder {
      color: #c0c0c0;
      font-weight: 500;
    }
  }

  /* 编辑器区域 */
  .tdoc-editor-wrap {
    position: relative;
  }

  /* 工具栏 */
  .tdoc-toolbar :deep(.w-e-bar) {
    background: transparent;
    border: none;
    border-bottom: 1px solid #e8e8e8;
    padding: 4px 0;
    margin-bottom: 0;
  }

  .tdoc-toolbar :deep(.w-e-bar-item) {
    button {
      border-radius: 4px;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #f0f0f0;
      }
    }
  }

  .tdoc-toolbar :deep(.w-e-bar-separator) {
    height: 20px;
    border-color: #e0e0e0;
  }

  /* 编辑内容区 */
  .tdoc-content :deep(.w-e-text-container) {
    border: none;
    min-height: 400px;
  }

  .tdoc-content :deep(.w-e-text) {
    padding: 20px 0;
    font-size: 16px;
    line-height: 1.8;
    color: #333;

    p {
      margin: 0 0 8px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 20px 0 10px;
      font-weight: 600;
    }
  }

  .tdoc-content :deep(.w-e-placeholder) {
    top: 20px;
    left: 0;
    font-style: normal;
    color: #c0c0c0;
  }
</style>

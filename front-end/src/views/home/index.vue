<template>
  <div class="page-container">
    <div class="page-title">工作台</div>
    <div class="page-subtitle">笔记数据概览</div>

    <!-- 统计卡片 -->
    <a-row :gutter="20">
      <a-col :span="8">
        <div class="stat-card">
          <div class="stat-card-icon icon-notes">
            <FileTextOutlined />
          </div>
          <div class="stat-card-body">
            <span class="stat-card-label">笔记总数</span>
            <span class="stat-card-value">{{ stats.noteCount }}</span>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="stat-card">
          <div class="stat-card-icon icon-groups">
            <FolderOutlined />
          </div>
          <div class="stat-card-body">
            <span class="stat-card-label">分组总数</span>
            <span class="stat-card-value">{{ stats.groupCount }}</span>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="stat-card">
          <div class="stat-card-icon icon-recent">
            <ClockCircleOutlined />
          </div>
          <div class="stat-card-body">
            <span class="stat-card-label">今日新增</span>
            <span class="stat-card-value">{{ todayNotes }}</span>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 近期笔记 -->
    <div class="recent-section">
      <h3 class="section-title">近期新增</h3>
      <div class="section-card">
        <a-table
          :columns="columns"
          :data-source="stats.recentNotes"
          :loading="loading"
          :pagination="false"
          row-key="id"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'created_at'">
              {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm') }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ClockCircleOutlined, FileTextOutlined, FolderOutlined } from '@ant-design/icons-vue';
  import to from 'await-to-js';
  import dayjs from 'dayjs';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { dashboardApi } from '@/api/modules/dashboard';

  const loading = ref(false);
  const stats = reactive({ noteCount: 0, groupCount: 0, recentNotes: [] as any[] });

  const todayNotes = computed(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return stats.recentNotes.filter((n: any) => dayjs(n.created_at).format('YYYY-MM-DD') === today).length;
  });

  const columns = [
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '所属分组', dataIndex: 'group_name', width: 150 },
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
  ];

  const fetchStats = async () => {
    loading.value = true;
    const [err, res] = await to(dashboardApi.stats());
    loading.value = false;
    if (err) return;
    stats.noteCount = res.noteCount;
    stats.groupCount = res.groupCount;
    stats.recentNotes = res.recentNotes || [];
  };

  onMounted(fetchStats);
</script>

<style scoped lang="scss">
  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    .stat-card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      font-size: 20px;
      flex-shrink: 0;

      &.icon-notes {
        color: var(--color-primary);
        background: var(--color-primary-light);
      }

      &.icon-groups {
        color: var(--color-accent-amber);
        background: var(--color-accent-amber-light);
      }

      &.icon-recent {
        color: var(--color-accent-blue);
        background: var(--color-accent-blue-light);
      }
    }

    .stat-card-body {
      display: flex;
      flex-direction: column;

      .stat-card-label {
        font-size: 13px;
        color: var(--color-text-muted);
        margin-bottom: 4px;
      }

      .stat-card-value {
        font-size: 26px;
        font-weight: 700;
        color: var(--color-text-primary);
        line-height: 1;
      }
    }
  }

  .recent-section {
    margin-top: 24px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 12px;
    }

    .section-card {
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: 4px;
    }
  }
</style>

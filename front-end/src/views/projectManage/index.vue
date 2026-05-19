<!--
 * @FilePath: /vue3-template-project/src/views/projectManage/index.vue
 * @Description: 项目管理
-->
<template>
  <div class="page-container project-manage-container">
    <div class="card flex flex-col gap-4">
      <a-input-search
        v-model:value="searchVal"
        placeholder="输入数据集名称关键字"
        :loading="searchLoading"
        enter-button
        allow-clear
        style="width: 300px"
        @search="handleSearch"
      />
      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="tableLoading"
        bordered
        :scroll="{ x: 'max-content' }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, text, record }">
          <!-- <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template> -->
          <template v-if="column.dataIndex === 'createTime'">
            <span>{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a @click="handleDetail(record)">查看项目详情</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <DetailModal v-model:open="detailModalOpen" />
</template>

<script setup lang="ts">
  import { TableColumnType } from 'ant-design-vue';
  import to from 'await-to-js';
  import dayjs from 'dayjs';
  import { onMounted, reactive, ref } from 'vue';
  import DetailModal from './components/DetailModal.vue';
  import mockApi from '@/api/modules/mock';

  const searchVal = ref('');
  const searchLoading = ref(false);
  const tableLoading = ref(false);
  const columns: TableColumnType[] = [
    { title: '项目id', dataIndex: 'id', width: '100' },
    { title: '住建项目名称', dataIndex: 'name', width: '200' },
    { title: '住建项目编码', dataIndex: 'code', width: '200' },
    { title: '创建时间', dataIndex: 'createTime', width: '200' },
    { title: '操作', dataIndex: 'actions', width: '200', fixed: 'right' }
  ];
  const dataSource = ref([{}]);
  const pagination = reactive({
    total: 200,
    current: 1,
    pageSize: 10
  });
  const detailModalOpen = ref(false);

  const handleSearch = () => {
    pagination.current = 1;
    getTableData();
  };

  const getTableData = async () => {
    tableLoading.value = true;
    const [err, res] = await to<any>(
      mockApi.list({
        keyWord: searchVal.value,
        pageNo: pagination.current,
        pageSize: pagination.pageSize
      })
    );
    tableLoading.value = false;
    console.log('请求结果：', res);
    // 模拟异步请求数据
    if (err) {
      console.error('请求失败：', res);
      return;
    }
    dataSource.value = res?.list;
    pagination.total = res?.total;
    console.log('表格数据：', dataSource.value);
  };

  const handleTableChange = page => {
    console.log('分页信息：', page);
  };

  const handleDetail = record => {
    console.log('查看详情：', record);
    detailModalOpen.value = true;
  };

  onMounted(() => {
    // getTableData();
  });
</script>

<style scoped lang="scss">
  // .project-manage-container {}
</style>

<template>
  <a-modal
    :open="open"
    title="单体详情"
    width="1000px"
    class="detail-modal"
    centered
    :footer="null"
    @cancel="handleCancel"
  >
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
    >
      <template #bodyCell="{ column, record, index }" />
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
  import { TableColumnType } from 'ant-design-vue';
  import { ref } from 'vue';

  interface Props {
    open: boolean;
  }
  const props = withDefaults(defineProps<Props>(), { open: false });
  const emit = defineEmits(['update:open']);

  const columns: TableColumnType[] = [
    { title: '序号', key: 'index', customRender: ({ index }) => index + 1 },
    { title: '单体名称', dataIndex: 'name', key: 'name' },
    { title: '单体编号', dataIndex: 'code', key: 'code' }
  ];

  const dataSource = ref([
    {
      key: '1',
      name: '楼栋1',
      code: '500103-03-202412-1546-0124-02-WX4G0S8Q9Z_7A3F_D1C8'
    },
    {
      key: '2',
      name: '楼栋2',
      code: '500103-03-202412-1546-0124-02-WX4G0S8Q9Z_7A3F_D1C9'
    },
    {
      key: '3',
      name: '楼栋3',
      code: '500103-03-202412-1546-0124-02-WX4G0S8Q9Z_7A3F_D1C4'
    }
  ]);

  const handleCancel = () => {
    console.log('取消');
    emit('update:open', false);
  };
</script>

<style lang="scss" scoped>
  // .coord-modal {
  // }
</style>

<template>
  <a-modal
    :open="open"
    title="住建项目详情"
    width="90%"
    :footer="null"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-flex vertical>
      <!-- 项目信息展示 -->
      <h2>住建项目1</h2>
      <a-descriptions :column="3">
        <a-descriptions-item
          v-for="item in developmentDescriptions"
          :key="item.label"
          :label="item.label"
        >
          <template v-if="item.label === '包含房屋工程建筑单体数量'">
            <a @click="handleOpenModal">{{ item.value }}</a>
          </template>
          <template v-else>{{ item.value }}</template>
        </a-descriptions-item>
      </a-descriptions>

      <!-- 项目阶段标签 -->
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane
          v-for="item in tabsList"
          :key="item.key"
          :tab="item.label"
        />
      </a-tabs>

      <!-- 项目详情信息 -->

      <a-spin
        tip="loading..."
        :spinning="isLoading"
      >
        <a-flex>
          <div class="imgbox">
            <div
              v-if="activeKey === '1'"
              class="selectbox"
            >
              选择图层:
              <a-select
                ref="select"
                v-model:value="Applicationphase"
                :options="Applicationphase_options"
                style="width: 120px; margin-left: 10px"
                @change="handleChange"
              />
            </div>
            <a-image
              v-if="activeKey === '1'"
              class="project-image"
              :width="200"
              :src="projectImg"
            />
          </div>

          <a-descriptions :title="`${'住建项目1'} ${constructionDescriptions[activeKey].title}`">
            <a-descriptions-item
              v-for="item in constructionDescriptions[activeKey].descriptions"
              :key="item.label"
              :label="item.label"
            >
              {{ item.value }}
            </a-descriptions-item>
          </a-descriptions>
        </a-flex>
      </a-spin>
    </a-flex>
  </a-modal>
  <NumModal v-model:open="numModalOpen" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import NumModal from './NumModal.vue';
  import projectImg from '@/assets/img/project.png';

  interface Props {
    open: boolean;
    detail?: any;
  }
  const props = withDefaults(defineProps<Props>(), { open: false, detail: undefined });
  const emit = defineEmits(['update:open']);
  const isLoading = ref(false);
  const Applicationphase = ref('');
  const Applicationphase_options = ref([
    {
      value: '1',
      label: '发改'
    },
    {
      value: '2',
      label: '勘察'
    },
    {
      value: '3',
      label: '设计'
    },
    {
      value: '4',
      label: '施工'
    },
    {
      value: '5',
      label: '质量监督'
    },
    {
      value: '6',
      label: '竣工验收'
    },
    {
      value: '7',
      label: '城建档案'
    }
  ]);

  const developmentDescriptions = ref([
    { label: '项目类别', value: '房屋工程小区边界' },
    { label: '住建项目编码', value: '500103-03-202412-1546-0124-02-WX4G0S8Q9Z_7A3F_D1C8' },
    { label: '包含房屋工程建筑单体数量', value: '3' },
    { label: '施工图审查合格书编号', value: '01202410240024' },
    { label: '地勘报告编号', value: '20230716191001' },
    { label: '所属发改项目代码', value: '510104-2024-01-893456' },
    { label: '施工许可证号', value: '310115-2024-SGXK-008765' },
    { label: '质量报监编号', value: '渝A-2024-ZLBJ-JZ-03456' },
    { label: '竣工联合验收意见书编号', value: '440305-2024-JGYX-012987' }
  ]);
  const activeKey = ref('1');
  const tabsList = ref([
    { key: '1', label: '发改' },
    { key: '2', label: '勘察' },
    { key: '3', label: '设计' },
    { key: '4', label: '施工' },
    { key: '5', label: '质量监督' },
    { key: '6', label: '竣工验收' },
    { key: '7', label: '城建档案' }
  ]);
  const constructionDescriptions = ref({
    '1': {
      title: '',
      descriptions: [
        { label: '项目类别', value: '住建项目' },
        { label: '立项文号', value: '20250827GHGJF' },
        { label: '建设单位', value: '重庆对外建设（集团）有限公司' },
        { label: '项目地址', value: '渝中区上新华路段' },
        { label: '占地面积', value: '1.28公顷' },
        { label: '建筑面积', value: '4000㎡' },
        { label: '投资金额', value: '3000万' }
      ]
    },
    '2': {
      title: '勘察环节 成果信息',
      descriptions: [
        { label: '勘察项目编号', value: '20230716191001' },
        { label: '工程详细地址', value: '渝中区上新华路段' },
        { label: '勘察阶段', value: '地质勘察' },
        { label: '勘察单位', value: '重庆康翔实业集团有限公司' },
        { label: '勘察负责人', value: '杨国华' },
        { label: '进场时间起', value: '2022-02-01' },
        { label: '进场时间止', value: '2022-04-26' }
      ]
    },
    '3': {
      title: '设计环节 成果信息',
      descriptions: [
        { label: '施工图审查合格书编号', value: '01202410240024' },
        { label: '审查完成日期', value: '2022-01-21' },
        { label: '一次审查是否通过', value: '是' },
        { label: '一次审查时违反强制性标准数', value: '2' },
        { label: '施工图审查机构名称', value: '鸿鑫建设集团有限公司' },
        { label: '消防设计审核时间', value: '2022-02-21' },
        { label: '消防审查合格书编号', value: 'JS89498493849384FH8398' }
      ]
    },
    '4': {
      title: '施工环节 成果信息',
      descriptions: [
        { label: '施工许可证号', value: '310115-2024-SGXK-008765' },
        { label: '建设用地规划许可证编号', value: '地字第500103-2023-00089号' },
        { label: '建设工程规划许可证编号', value: '建字第500103-2023-00156号' },
        { label: '中标通知书编号', value: 'CQ-2023-ZB-07892' },
        { label: '发证日期', value: '2022-01-16' }
      ]
    },
    '5': {
      title: '质量监督信息',
      descriptions: [
        { label: '质量报监编号', value: '渝A-2024-ZLBJ-JZ-03456' },
        { label: '质量监督记录编号', value: '渝A-2024-ZLBJ-JZ-03456-1001' }
      ]
    },
    '6': {
      title: '竣工验收环节 成果信息',
      descriptions: []
    },
    '7': {
      title: '城建档案信息',
      descriptions: [
        // { label: '建筑单体/标段名称', value: 'XXX' },
        // { label: '住建项目编码', value: 'XXX' }
      ]
    }
  });
  const handleChange = value => {
    console.log(`selected ${value}`);
    isLoading.value = true;
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  };

  const numModalOpen = ref(false);

  const handleOpenModal = () => {
    // 打开模态框
    numModalOpen.value = true;
  };

  const handleCancel = () => {
    emit('update:open', false);
  };

  const handleOk = () => {
    emit('update:open', false);
  };
</script>

<style scoped lang="scss">
  .selectbox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .project-image {
    width: 200px;
    height: 200px;
    margin-right: 16px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  }

  .openBtn {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0 0;
  }
</style>

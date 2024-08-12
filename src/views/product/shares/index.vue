<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="stock.list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-space>
          <el-button size="small" type="success" @click="onHide(scope.row)"
            >隐藏股票</el-button
          >
          <el-button size="small" type="danger" @click="onLock(scope.row)"
            >锁定股票</el-button
          >
          <el-button size="small" type="warning" @click="handleEdit(scope.row)"
            >修改股票</el-button
          >
        </el-space>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'plate'">
        <ql-tag
          :name="scope.row.plate"
          :type="$getTypeOption('STOCK_TYPE')[scope.row.stock_type].remark"
        ></ql-tag>
      </slot>
    </template>
    <template #leftView
      ><el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >添加股票</el-button
      >
    </template>
  </table-modal>

  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="$upTableList(tableRef)"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
</template>
<script setup>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import addModal from "./module/add.vue";
import editModal from "./module/edit.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { num } = mixin();
const { $api, $upTableList } =
  getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const router = useRouter();
const codeType = ref("");
const tableRef = ref(null);
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const dialogFormVisible = ref(true);
const column = [
  { title: "股票名称", key: "name" },
  { title: "股票代号", key: "code" },
  {
    title: "股票地区/国家",
    key: "stock_type",
    typeList: "STOCK_TYPE",
    width: 100,
  },
  { title: "标的代码", key: "plate", isNeedSlot: true, width: 200 },
  { title: "交易币种", key: "currency" },

  { title: "现价", key: "price" },
  { title: "点差费率", key: "dc_rate" },
  { title: "显示状态", key: "is_show", typeList: "STOCK_SHOW" },
  { title: "股票状态", key: "status", typeList: "STOCK_PAY_STUTAS", width: 100 },
  { title: "创建时间", key: "create_at", keyType: "time", width: 170 },
  { title: "更新时间", key: "update_at", keyType: "time", width: 170 },
  { title: "涨跌幅%", key: "updown_p" },
  { title: "5天涨跌幅%", key: "5updown_p" },
  { title: "4", key: "edit_row", width: 400 },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    {
      type: "select",
      placeholder: "股票地区",
      key: "stock_type",
      optType: "STOCK_TYPE",
      label: "股票地区",
    },
    { type: "input", placeholder: "股票名字", key: "name", label: "股票名字" },
    { type: "input", placeholder: "股票代码", key: "code", label: "股票代码" },
    {
      type: "select",
      placeholder: "显示状态",
      key: "is_show",
      optType: "STOCK_SHOW",
      label: "显示状态",
    },
    {
      type: "select",
      placeholder: "股票状态",
      key: "status",
      optType: "LOCK_STUTAS",
      label: "股票状态",
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  name: "",
  status: "",
  code_type: "",
  code: "",
  is_show: "",
});

const total = computed(() => state.tableData.length);

// methods
const editInfo = ref();

const handleEdit = (row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
};
// 隐藏股票
const onHide = ({ id, is_show }) => {
  $api.stock.show({ stock_id: id, show: +!is_show }).then((res) => {
    $upTableList(tableRef.value);
  });
};

// 锁定股票
const onLock = ({ id, status }) => {
  $api.stock.lock({ stock_id: id, lock: +!status }).then((res) => {
    $upTableList(tableRef.value);
  });
};
</script>
<style lang="scss" scoped>
.table-container {
  .form-inline {
    margin: 15px;
    text-align: left;
  }
  // .table-list {
  //   margin: 15px;
  // }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

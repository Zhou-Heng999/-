<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="number.list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button type="primary" @click="handleEdit(scope.row)"
          >修改指数</el-button
        >
      </slot>

      <slot v-if="scope.row && scope.row.key == 'name'">
        {{ scope.row.name }}/{{ scope.row.code }}
      </slot>
    </template>
    <template #leftView
      ><el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >添加指数产品</el-button
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
  { title: "指数名称/指数代码", key: "name", isNeedSlot: true },
  { title: "首页显示状态", key: "index_show", typeList: "STOCK_SHOW" },
  { title: "列表显示状态", key: "list_show", typeList: "STOCK_SHOW" },
  { title: "交易状态", key: "status", typeList: "TRADING_STATUS" },
  { title: "当前点数", key: "dc_rate" },
  { title: "涨跌点数", key: "float_price" },
  { title: "涨跌幅", key: "status" },
  { title: "买入范围", key: "create_at" },
  { title: "手续费 (手)", key: "fee" },
  { title: "每手保证金", key: "deposit" },
  { title: "操作时间", key: "create_at", keyType: "time" },

  { title: "4", key: "edit_row", width: 200 },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [{ type: "input", placeholder: "商品名字", key: "name" }],
});
const queryParam = reactive({
  //搜索表单
  name: "",
  type: "",
});

// methods
const editInfo = ref();

const handleEdit = (row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
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

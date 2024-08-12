<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="newshares.list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" type="primary" @click="handleEdit(scope.row)"
          >编辑</el-button
        >

        <el-popconfirm title="是否删除此股票?" @confirm="deleIt(scope.row)">
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
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
        >添加新股</el-button
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
  { title: "新股名称/新股代码", key: "name" },
  { title: "股票地区", key: "stock_type", typeList: "STOCK_TYPE" },
  { title: "标的代码", key: "plate", isNeedSlot: true, width: 200 },
  { title: "交易币种", key: "currency" },

  { title: "最大购买数量", key: "max_count" },
  { title: "价格", key: "price" },
  // { title: "新股模式", key: "newshares_model", typeList: "NEW_SHARES_MODEL" },
  { title: "显示状态", key: "is_show", typeList: "STOCK_SHOW" },
  { title: "申购时间", key: "bug_at", keyType: "time", width: 170 },

  { title: "4", key: "edit_row", width: 200 },
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
      placeholder: "新股模式",
      key: "is_show",
      optType: "NEW_SHARES_MODEL",
      label: "新股模式",
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  name: "",
  type: "",
});

// methods

// 删除新股
const deleIt = (row) => {
  $api.newshares
    .del({
      id: row.id,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
  console.log(row);
};
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

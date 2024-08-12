<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="items.list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'shop_state'">
        <el-tag v-if="scope.row.shop_state == 0" type="success">是</el-tag>
        <el-tag v-else type="danger">否</el-tag>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'img_small'">
        <img
          :src="$imgeUrl + scope.row.img_small"
          alt
          style="max-height: 50px"
          width="50"
        />
      </slot>
      <slot v-if="scope.row && scope.row.key == 'state'">
        <el-tag v-if="scope.row.state == 0" type="success">上架</el-tag>
        <el-tag v-else type="danger">下架</el-tag>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >

        <el-button
          v-if="scope.row.state == 0"
          size="small"
          type="danger"
          @click="handleOnLine(scope.row)"
          >下线</el-button
        >
        <el-button
          v-else
          size="small"
          type="warning"
          @click="handleOnLine(scope.row)"
          >上线</el-button
        >

        <el-button
          v-if="scope.row.shop_state == 0"
          size="small"
          type="danger"
          @click="handleShopOnLine(scope.row)"
          >不兑</el-button
        >
        <el-button
          v-else
          size="small"
          type="warning"
          @click="handleShopOnLine(scope.row)"
          >可兑</el-button
        >
      </slot>
    </template>
    <template #leftView
      ><el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >添加商品</el-button
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
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 50,
  search: "",
  roles: [],
  typelist: [],
});
const dialogFormVisible = ref(true);
const column = [
  { title: "编号", key: "id" },
  { title: "名字", key: "name" },
  { title: "商品图片", key: "img_small", isNeedSlot: true },
  { title: "兑换所需积分", key: "exchange_points" },
  { title: "兑换数量", key: "exchange_num" },
  { title: "剩余可兑换数量", key: "exchange_rest" },
  { title: "是否上架", key: "state", isNeedSlot: true },
  { title: "是否可兑换", key: "shop_state", isNeedSlot: true },
  { title: "商品类型", key: "typename" },
  { title: "4", key: "edit_row", width: 200 },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "商品名字", key: "name" },
    {
      type: "select",
      key: "type", // 表单域model字段 必填
      placeholder: "类型",
      options: [],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  name: "",
  type: "",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getItemsTypeList();
});
const tableRowClassName = (e) => {
  let { row, rowIndex } = e;
  // console.log(row, rowIndex, store.state.app.userInfo.username);
  if (row.name == store.state.app.userInfo.username) {
    return "warning-row";
  }
  return "";
};

// methods
const handleShopOnLine = (row) => {
  $api.items
    .shopOnline({
      idx: row.id,
      state: row.shop_state == 1 ? 0 : 1,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
};

const handleUpgradeOnLine = (row) => {
  $api.items
    .upgradeOnline({
      idx: row.id,
      state: row.upgrade_state == 1 ? 0 : 1,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
};

const handleOnLine = (row) => {
  $api.items
    .itemsOnline({
      idx: row.id,
      state: row.state == 1 ? 0 : 1,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
};

const handleDIYOnLine = (row) => {
  $api.items
    .DIYOnline({
      idx: row.id,
      state: row.customize_state == 1 ? 0 : 1,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
};

const getItemsTypeList = () => {
  $api.items.typelist({}).then((res) => {
    state.typelist = res.data;
    formConfig.formItemList[1].options = res.data;
  });
};

const resetDateFilter = () => {
  filterTableRef.value.clearFilter("date");
};

const clearFilter = () => {
  filterTableRef.value.clearFilter();
};

const formatter = (row) => row.address;
const filterTag = (value, row) => row.tag === value;
const filterHandler = (value, row, column) => {
  const { property } = column;
  return row[property] === value;
};
const handleEdit = (index, row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
};

const handleSizeChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  getItemsList();
  // request api to change tableData
};
const handleCurrentChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  getItemsList();
};
const onSubmit = () => {
  // eslint-disable-next-line no-console
  console.log("submit!");
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

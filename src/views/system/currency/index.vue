<template>
  <div class="button-group">
    <el-button type="primary" :icon="Plus" @click="isAddShow = true"
      >添加币种</el-button
    >
  </div>

  <div class="table-container">
    <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="tag" label="标识"> </el-table-column>
      <el-table-column prop="idx" label="排序"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-button
            size="small"
            :type="scope.row.status == 0 ? 'success' : 'danger'"
          >
            {{ scope.row.status == 0 ? "上架" : "下架" }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该条记录吗？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <add-modal
    :addVisible="isAddShow"
    :tagData="tagData"
    @updateList="getUsersList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    :tagData="tagData"
    @updateList="getUsersList"
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
import codeModal from "@/components/googleCode/index.vue";
import store from "@/store";
import { useRouter } from "vue-router";
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const router = useRouter();
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 100,
  search: "",
  tagData: [],
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getUsersList();
  getTag();
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

const getUsersList = () => {
  $api.currency
    .getQry({
      size: "100",
      page: "1",
    })
    .then((res) => {
      state.tableData = res.data;
      console.log("getUsersList", res);
      tableLoading.value = false;
    });
};
const getTag = () => {
  $api.dictionary
    .list({
      size: "100",
      page: "1",
    })
    .then((res) => {
      let a = res.data.find((item) => item.type == "CURRENCY_CODE");
      state.tagData = a.itemList;
      console.log("tagData", state.tagData);
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
// 删除
const handleDelete = (index, row) => {
  console.log(index,row);
  $api.currency
    .del({
      id: row.id,
    })
    .then((res) => {
      console.log('删除',res);
      state.tableData.splice(index, 1);
    });
};

const handleSizeChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  // request api to change tableData
};
const handleCurrentChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  // request api to change tableData
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
  .table-list {
    margin: 15px;
  }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

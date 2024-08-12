<template>
  <div class="table-container">
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">添加白名单</el-button>
    </div>

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
      <el-table-column prop="id" label="编号" width="180"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="create_date" label="添加时间"> </el-table-column>

      <el-table-column align="right">
        <template #default="scope">
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
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="getWhiteList"
    @closeModal="isAddShow = false"
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
import mixin from "@/mixins/list.js";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const router = useRouter();
const isCodeShow = ref(false);
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 100,
  search: "",
});
const dialogFormVisible = ref(true);

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getWhiteList();
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
const getWhiteList = () => {
  $api.player
    .getWhiteList({
      page : state.currentPage,
      size : state.pageSize,
    })
    .then((res) => {
      state.tableData = res.data;
      state.total = res.count
      tableLoading.value = false;
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

// 删除用户
const handleDelete = (index, row) => {
  deleWhite(row.phone)
};

const deleWhite = (phone) => {
  $api.player
    .deleteWhite({
      phone: phone,
    })
    .then((res) => {
      getWhiteList()
    });
};

const handleSizeChange = (val) => {
  state.pageSize = val;
  state.currentPage = 1;
  getWhiteList();
};
const handleCurrentChange = (val) => {
  state.currentPage = val;
  getWhiteList();
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

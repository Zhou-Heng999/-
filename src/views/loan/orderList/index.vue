<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getOrderList"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <el-divider />
    <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="id" label="序号"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="create_date" label="创建时间"> </el-table-column>
      <el-table-column prop="end_date" label="还贷时间"> </el-table-column>
      <el-table-column prop="symbol" label="币种符号"></el-table-column>
      <el-table-column prop="loan_num" label="借贷数量"></el-table-column>
      <el-table-column prop="stake_num" label="质押数量"></el-table-column>
      <el-table-column prop="profit" label="利息"> </el-table-column>
      <el-table-column prop="day" label="借贷期限"></el-table-column>
      <el-table-column prop="day_rate" label="日利化率"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-button size="small" :type="scope.row.status == 1 ? 'success' : 'warning'">
            {{ scope.row.status == 1 ? '已还贷' : '进行中' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:currentPage="state.currentPage1"
        v-model:page-size="state.pageSize"
        :page-sizes="[20, 100, 200, 300, 400]"
        :small="small"
        :disabled="disabled"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
  </div>
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
import mixin from "@/mixins/list.js";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const filterTableRef = ref();
const tableLoading = ref(true);
const state = reactive({
  total_value : "0",
  stake_str : "",
  tableData: [],
  currentPage: 1,
  pageSize: 100,
  search: "",
});

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "账号", key: "account" },
    {
      type: "datetimerange",
      key: "createTime",
      placeholder: ["开始时间", "结束时间"],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  account: "",
  createTime: [0, 0],
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getOrderList();
});

// methods
const getOrderList = () => {
  tableLoading.value = true
  $api.loan
    .getOrderList({
      account : queryParam.account,
      phone : queryParam.phone,
      start_time : queryParam.createTime[0],
      end_time : queryParam.createTime[1],
      size: state.pageSize,
      page: state.currentPage,
    })
    .then((res) => {
      state.tableData = res.data;
      state.total = res.count;
      tableLoading.value = false
    });
};

const resetDateFilter = () => {
  filterTableRef.value.clearFilter("date");
};
const clearFilter = () => {
  filterTableRef.value.clearFilter();
};

const handleSizeChange = (val) => {
  state.pageSize = val;
  state.currentPage1 = 1;
  getOrderList();
};
const handleCurrentChange = (val) => {
  state.currentPage = val;
  getOrderList();
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

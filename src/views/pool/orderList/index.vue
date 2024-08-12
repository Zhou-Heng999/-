<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getOrderList"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="flex">
      <el-tag round type="info">质押总价值:{{ state.total_value }}USDT</el-tag>
      <el-tag round type="success">质押数量:{{ state.stake_str }}</el-tag>
    </div>
    <el-divider />
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
      <el-table-column prop="id" label="序号"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="pool_name" label="矿池名称"> </el-table-column>
      <el-table-column prop="stake_time" label="挖矿周期(天)"></el-table-column>
      <el-table-column prop="stake_symbol_id" label="质押代币"> </el-table-column>
      <el-table-column prop="price" label="价格(USDT)"> </el-table-column>
      <el-table-column prop="quantity" label="锁币数量"> </el-table-column>
      <el-table-column prop="create_date" label="锁币时间"> </el-table-column>
      <el-table-column prop="end_date" label="到期时间"> </el-table-column>
      <el-table-column prop="profit" label="预期收益"> </el-table-column>
      <el-table-column prop="profit_usdt" label="实际收益"></el-table-column>

      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.order_status==0" type="info">锁币中</el-tag>
          <el-tag v-else-if="scope.row.order_status==1" type="danger">待提币</el-tag>
          <el-tag v-else type="success">已领取</el-tag>
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
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const router = useRouter();
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  total_value : "0",
  stake_str : "",
  tableData: [],
  currentPage: 1,
  pageSize: 100,
  search: "",
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "账号", key: "account" },
    {
      type: "datetimerange",
      key: "createTime",
      placeholder: ["开始购买时间", "结束购买时间"],
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
  getOrderSta();
  getOrderList();
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
const getOrderList = () => {
  tableLoading.value = true
  $api.pool
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
      state.total_value = res.total_value
      state.stake_str = res.stake_str
      tableLoading.value = false
    });
};

const getOrderSta = () => {
  $api.mining
    .getOrderSta({})
    .then((res) => {
      state.tj = res.data;
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

const handleSizeChange = (val) => {
  state.pageSize = val;
  state.currentPage1 = 1;
  getOrderList();
};
const handleCurrentChange = (val) => {
  state.currentPage = val;
  getOrderList();
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

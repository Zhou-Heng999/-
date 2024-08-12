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
      <el-tag round type="info">矿机总数量:{{ state.tj.totalQuantity }}台</el-tag>
      <el-tag round type="success">总价格:{{ state.tj.totalMoney }}USDT</el-tag>
      <el-tag round type="warning">排除下属统计：矿机总数量(元):{{ state.tj.nototalQuantity }}台</el-tag>
      <el-tag round type="danger">总价格:{{ state.tj.nototalMoney }}USDT</el-tag>
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
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="name" label="矿机名称"> </el-table-column>
      <el-table-column prop="term_type" label="挖矿周期">
        <template #default="scope">
          {{scope.row.term_value}}
          <el-tag v-if="scope.row.term_type==1" type="success">小时</el-tag>
          <el-tag v-else type="success">天</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="价格(USDT)"> </el-table-column>
      <el-table-column prop="quantity" label="购买数量"> </el-table-column>
      <el-table-column prop="create_date" label="购买时间"> </el-table-column>
      <el-table-column prop="profit" label="收益"> </el-table-column>
      <el-table-column prop="sell_date" label="卖出时间"></el-table-column>

      <el-table-column prop="order_status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.order_status==1" type="warning">{{ scope.row.end_date}}</el-tag>
          <el-tag v-else-if="scope.row.order_status==2" type="danger">可卖</el-tag>
          <el-tag v-else type="success">已卖</el-tag>
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
  tj : {},
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
    { type: "input", placeholder: "手机号", key: "phone" },
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
  phone: "",
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
  $api.mining
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

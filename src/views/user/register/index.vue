<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="searchQuery"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="flex">
      <el-tag round type="info">注册数量:{{ state.tj.count }}</el-tag>
      <el-tag round type="success">今日新增:{{ state.tj.today }}</el-tag>
      <el-tag round type="warning">今日注册用户总充值金额(元):{{ state.tj.todayRechargeSum }}</el-tag>
      <el-tag round type="danger">今日注册用户充值人数:{{ state.tj.todayRecharge }}</el-tag>
      <el-tag round type="info">累计实名用户:{{ state.tj.bindCount }}</el-tag>
      <el-tag round type="success">今日实名用户:{{ state.tj.bindTodayCount }}</el-tag>
    </div>
    <el-divider />
    <el-tabs type="border-card">
      <el-tab-pane label="今日注册">
        <el-table
          ref="filterTableRef1"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb1"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="id" label="ID" width="180"> </el-table-column>
          <el-table-column prop="account" label="账号" width="180"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="create_date" label="注册时间"> </el-table-column>
          <el-table-column prop="CNY" label="CNY"></el-table-column>
          <el-table-column prop="USD" label="USD"></el-table-column>
          <el-table-column prop="HKD" label="HKD"></el-table-column>
          <el-table-column prop="bank" label="银行卡号"></el-table-column>
        </el-table>
        <el-pagination
            v-model:currentPage="state.currentPage1"
            v-model:page-size="state.pageSize1"
            :page-sizes="[20, 100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total1"
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
      </el-tab-pane>

      <el-tab-pane label="总注册">
        <el-table
          ref="filterTableRef2"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb2"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >
        <el-table-column prop="id" label="ID" width="180"> </el-table-column>
        <el-table-column prop="account" label="账号" width="180"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="create_date" label="注册时间"> </el-table-column>
        <el-table-column prop="CNY" label="CNY"></el-table-column>
        <el-table-column prop="USD" label="USD"></el-table-column>
        <el-table-column prop="HKD" label="HKD"></el-table-column>
        <el-table-column prop="bank" label="银行卡号"></el-table-column>
        </el-table>
        <el-pagination
            v-model:currentPage="state.currentPage2"
            v-model:page-size="state.pageSize2"
            :page-sizes="[20, 100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total2"
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
      </el-tab-pane>
      </el-tabs>
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
import codeModal from "@/components/googleCode/index.vue";
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

  tb1 : [],
  currentPage1 : 1,
  pageSize1 : 20,
  total1 : 0,

  tb2 : [],
  currentPage2 : 1,
  pageSize2 : 20,
  total2 : 0,
});

onMounted(() => {
  searchQuery()
});

const searchQuery = () => {
  getTjInfo();
  getTodayRegister();
  getTotalRegister();
  tableLoading.value = false;
}

const getTjInfo = () => {
  $api.player
    .sta({
    })
    .then((res) => {
      state.tj.count = res.data.count;
      state.tj.today = res.data.today;
      state.tj.bindCount = res.data.bindCount;
      state.tj.bindTodayCount = res.data.bindTodayCount;
      state.tj.todayRecharge = res.data.todayRecharge;
      state.tj.todayRechargeSum = res.data.todayRechargeSum;
    });
}

const getTodayRegister = () => {
  $api.player
    .getTodayUserList({
      size: state.pageSize1,
      page: state.currentPage1,
      phone : queryParam.phone,
      account : queryParam.account,
    })
    .then((res) => {
      state.total1 = res.count
      state.tb1 = res.data;
    });
}

const getTotalRegister = () => {
  $api.player
    .getAllUserList({
      size: state.pageSize2,
      page: state.currentPage2,
      phone : queryParam.phone,
      account : queryParam.account,
    })
    .then((res) => {
      state.total2 = res.count
      state.tb2 = res.data;
    });
}

const handleSizeChange2 = (val) => {
  state.pageSize2 = val;
  state.currentPage2 = 1;
  getTotalRegister();
};
const handleCurrentChange2 = (val) => {
  state.currentPage2 = val;
  getTotalRegister();
};

const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getTodayRegister();
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getTodayRegister();
};

const dialogFormVisible = ref(true);

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "手机号", key: "phone" },
    { type: "input", placeholder: "账号", key: "account" },
  ],
});
const queryParam = reactive({
  //搜索表单
  phone: "",
  account: "",
});

const editInfo = ref();

const tableRowClassName = (e) => {
  let { row, rowIndex } = e;
  // console.log(row, rowIndex, store.state.app.userInfo.username);
  if (row.name == store.state.app.userInfo.username) {
    return "warning-row";
  }
  return "";
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

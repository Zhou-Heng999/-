<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="searchQuery"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
        <el-table
          ref="filterTableRef1"
          stripe
          class="table-list"
          row-key="id"
          :data="state.tb1"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >

        <el-table-column prop="account" label="账号"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="type" label="操作类型">
          <template #default="scope">
            <el-tag v-if="scope.row.type==1" type="success">转入</el-tag>
            <el-tag v-else-if="scope.row.type==2" type="danger">转出</el-tag>
            <el-tag v-else type="info">收益</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="交易金额">
          <template #default="scope">
            <el-tag v-if="scope.row.is_add==1" type="success">+{{scope.row.money}}</el-tag>
            <el-tag v-else type="danger">{{scope.row.money}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="交易前金额"> </el-table-column>
        <el-table-column prop="create_date" label="操作时间"> </el-table-column>
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
  tb1 : [],
  currentPage1 : 1,
  pageSize1 : 20,
  total1 : 0,
});
const dialogFormVisible = ref(true);

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "手机号", key: "phone" },
    { type: "input", placeholder: "账号", key: "account" },
    {
      type: "datetimerange",
      key: "createTime",
      placeholder: ["开始时间", "结束时间"],
    },
    {
      type: "select",
      key: "type", // 表单域model字段 必填
      placeholder: "",
      options: [
        {
          value: 0,
          name: "全部",
        },
        {
          value: 1,
          name: "转入",
        },
        {
          value: 2,
          name: "转出",
        },
        {
          value: 3,
          name: "收益",
        },
      ],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  phone: "",
  account: "",
  createTime: [0, 0],
  type:"",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();

const searchQuery = () => {
  getWalletRecordList()
}

onMounted(() => {
  getWalletRecordList();
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
const getWalletRecordList = () => {
  $api.wallet
    .getWalletRecordList({
      account : queryParam.account,
      phone : queryParam.phone,
      stype : queryParam.type,
      start_time : queryParam.createTime[0],
      end_time : queryParam.createTime[1],
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.tb1 = res.data;
      state.total1 = res.count
      console.log("getUsersList", res);
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

const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getCapitalUsdtList();
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getCapitalUsdtList();
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

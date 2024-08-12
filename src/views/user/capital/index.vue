<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="player.getCapitalUsdtList"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'money'">
        <el-tag v-if="scope.row.is_add == 1" type="success"
          >+{{ scope.row.money }}</el-tag
        >
        <el-tag v-else type="danger">{{ scope.row.money }}</el-tag>
      </slot>
    </template>
  </table-modal>
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
  tb1: [],
  currentPage1: 1,
  pageSize1: 20,
  total1: 0,

  tb2: [],
  currentPage2: 1,
  pageSize2: 20,
  total2: 0,
});
const dialogFormVisible = ref(true);
const column = [
  { title: "账号", key: "account" },
  { title: "手机号", key: "phone" },
  { title: "交易量", key: "money", isNeedSlot: true },
  { title: "交易前", key: "balance" },
  { title: "币种", key: "currency" },
  { title: "详情", key: "des" },
  { title: "操作时间", key: "create_date" },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "手机号", key: "phone" },
    { type: "input", placeholder: "账号", key: "account" },
    {
      type: "datetimerange",
      key: ["start_time", "end_time"],
      placeholder: ["开始时间", "结束时间"],
    },
    {
      type: "select",
      key: "flag", // 表单域model字段 必填
      placeholder: "资金类型",
      options: [
        {
          value: 1,
          label: "usdt",
        },
        {
          value: 2,
          label: "rmb",
        },
        {
          value: 3,
          label: "积分",
        },
      ],
    },
    {
      type: "select",
      key: "type", // 表单域model字段 必填
      placeholder: "类型",
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "收入",
        },
        {
          value: 2,
          label: "支出",
        },
      ],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  phone: "",
  account: "",
  start_time: "",
  end_time: "",
  type: 0,
  flag: 1,
});

const total = computed(() => state.tableData.length);
const editInfo = ref();

const searchQuery = () => {
  // getCapitalUsdtList();
  // getCapitalList();
};

onMounted(() => {
  // getCapitalUsdtList();
  // getCapitalList();
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
const getCapitalUsdtList = () => {
  $api.player
    .getCapitalUsdtList({
      account: queryParam.account,
      phone: queryParam.phone,
      stype: queryParam.type,
      start_time: queryParam.createTime[0],
      end_time: queryParam.createTime[1],
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.tb1 = res.data;
      state.total1 = res.count;
      console.log("getUsersList", res);
      tableLoading.value = false;
    });
};
const getCapitalList = () => {
  $api.player
    .getCapitalList({
      account: queryParam.account,
      phone: queryParam.phone,
      stype: queryParam.type,
      start_time: queryParam.createTime[0],
      end_time: queryParam.createTime[1],
      size: state.pageSize2,
      page: state.currentPage2,
    })
    .then((res) => {
      state.tb2 = res.data;
      state.total2 = res.count;
      console.log("getUsersList", res);
      tableLoading.value = false;
    });
};
const getJFList = () => {
  $api.player
    .getCapitalUsdtList({
      account: queryParam.account,
      phone: queryParam.phone,
      stype: queryParam.type,
      start_time: queryParam.createTime[0],
      end_time: queryParam.createTime[1],
      size: state.pageSize2,
      page: state.currentPage2,
    })
    .then((res) => {
      state.tb2 = res.data;
      state.total2 = res.count;
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
const handleSizeChange2 = (val) => {
  state.pageSize2 = val;
  state.currentPage2 = 1;
  getCapitalList();
};
const handleCurrentChange2 = (val) => {
  state.currentPage2 = val;
  getCapitalList();
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

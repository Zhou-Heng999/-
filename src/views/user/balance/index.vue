<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="player.getUserBalanceList"
    ref="tableRef"
  >
    <template #leftView>
      <div class="flex">
        <el-tag round type="warning">总人数:{{ state.total }}</el-tag>
        <el-tag round type="success" >CNY:{{ state.tj.CNY }}</el-tag>
        <el-tag round type="success" >USD:{{ state.tj.USD }}</el-tag>
        <el-tag round type="success" >HKD:{{ state.tj.HKD }}</el-tag>
        <el-tag round type="success" >融资CNY:{{ state.tj.RZ_CNY }}</el-tag>
        <el-tag round type="success" >融资USD:{{ state.tj.RZ_USD }}</el-tag>
        <el-tag round type="success" >融资HKD:{{ state.tj.RZ_HKD }}</el-tag>
      </div>
    </template>
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
const isAddShow = ref(false);
const isEditShow = ref(false);
const router = useRouter();
const isCodeShow = ref(false);
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tj: {},
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
const column = [
  { title: "id", key: "id" },
  { title: "账号", key: "account" },
  { title: "手机号", key: "phone" },
  { title: "账户余额", key: "balance" },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    {
      type: "select",
      key: "flag", // 表单域model字段 必填
      placeholder: "类型",
      options: [
        {
          value: "CNY",
          label: "CNY",
        },
        {
          value: 'USD',
          label: "USD",
        },
        {
          value: 'HKD',
          label: "HKD",
        },
      ],
    },
    { type: "input", placeholder: "账户余额从", key: "minMoney" },
    { type: "input", placeholder: "到", key: "maxMoney" },
  ],
});
const queryParam = reactive({
  //搜索表单
  minMoney: "",
  maxMoney: "",
  flag: "CNY",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  searchQuery();
});
const searchQuery = () => {
  // getUserBalanceList();
  getUserBalanceSta();
};
const tableRowClassName = (e) => {
  let { row, rowIndex } = e;
  // console.log(row, rowIndex, store.state.app.userInfo.username);
  if (row.name == store.state.app.userInfo.username) {
    return "warning-row";
  }
  return "";
};

// methods
const getUserBalanceList = () => {
  $api.player.getUserBalanceList(queryParam).then((res) => {
    state.tableData = res.data;
    state.total = res.count;
    console.log("getUsersList", res);
    tableLoading.value = false;
  });
};

const getUserBalanceSta = () => {
  $api.player.getUserBalanceSta({}).then((res) => {
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
  state.currentPage = 1;
  getUserBalanceList();
};
const handleCurrentChange = (val) => {
  state.currentPage = val;
  getUserBalanceList();
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

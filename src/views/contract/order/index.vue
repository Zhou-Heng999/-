<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getOrderList"
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
      @selection-change="selectChange"
    >
      <el-table-column prop="id" label="ID" width="50"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="name" label="币种">
        <template #default="scope">
          {{scope.row.name}}({{scope.row.text}})
        </template>
      </el-table-column>

      <el-table-column prop="create_date" label="委托时间"> </el-table-column>
      <el-table-column prop="entrust_count" label="委托数量"></el-table-column>
      <el-table-column prop="entrust_price" label="委托价格"> </el-table-column>
      <el-table-column prop="stop_profit_price" label="止盈价格"> </el-table-column>
      <el-table-column prop="stop_loss_price" label="止损价格"> </el-table-column>
      <el-table-column prop="entrust_money" label="委托金额"> </el-table-column>
      <el-table-column prop="order_type" label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.order_type==1" type="success">开多(X{{scope.row.leverage}})</el-tag>
          <el-tag v-else-if="scope.row.order_type==2" type="warning">开空(X{{scope.row.leverage}})</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deposit" label="保证金"> </el-table-column>
      <el-table-column prop="fee" label="手续费"> </el-table-column>
      <el-table-column prop="final_date" label="平仓时间"> </el-table-column>
      <el-table-column prop="final_price" label="平仓价格"> </el-table-column>
      <el-table-column prop="profit" label="盈利">
        <template #default="scope">
          <el-tag v-if="scope.row.profit > 0" type="danger">{{scope.row.profit}}</el-tag>
          <el-tag v-else type="success">{{scope.row.profit}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order_status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.order_status==0" type="info">委托</el-tag>
          <el-tag v-else-if="scope.row.order_status==1" type="warning">持仓</el-tag>
          <el-tag v-else-if="scope.row.order_status==2" type="success">平仓</el-tag>
          <el-tag v-else-if="scope.row.order_status==3" type="danger">爆仓</el-tag>
          <el-tag v-else-if="scope.row.order_status==4" type="info">撤单</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #default="scope">
          <el-button v-if="scope.row.order_status==0" size="small" type="warning" @click="handleCancel(scope.row)">撤单</el-button>
          <el-button v-if="scope.row.order_status==1" size="small" type="warning" @click="handleCancel(scope.row)">平仓</el-button>
        </template>
      </el-table-column>
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
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
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
  pageSize1: 100,
  symbolList : [],
  symbolList : [],
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
      placeholder: ["委托时间", "委托时间"],
    },
    {
      type: "select",
      key: "symbol_id", // 表单域model字段 必填
      placeholder: "币种",
      options: state.symbolList
    },
    {
      type: "select",
      key: "type", // 表单域model字段 必填
      placeholder: "状态",
      options: [
        {
          value: 0,
          name: "委托",
        },
        {
          value: 1,
          name: "持仓",
        },
        {
          value: 2,
          name: "平仓",
        },
        {
          value: 3,
          name: "爆仓",
        },
        {
          value: 2,
          name: "撤单",
        },
      ],
    }
  ],
});

const queryParam = reactive({
  //搜索表单
  phone: "",
  account: "",
  createTime: [0, 0],
  type:"",
  symbol_id:"",
});

const handleCancel = (row) => {
  $api.contract
    .cancelOrder({
      id:row.id,
    })
    .then((res) => {
      getOrderList()
    });
}

const getOrderList = () => {
  $api.contract
    .getOrderList({
      account : queryParam.account,
      phone : queryParam.phone,
      stype : queryParam.type,
      symbol_id : queryParam.symbol_id,
      start_time : queryParam.createTime[0],
      end_time : queryParam.createTime[1],
      order_type : queryParam.order_type,
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.tb1 = res.data;
      state.total1 = res.count
      tableLoading.value = false;
    });
};

const getAllCurrencyList = () => {
  $api.currency
    .getAllCurrencyList({})
    .then((res) => {
      state.symbolList = res.data;
      formConfig.formItemList[3].options = state.symbolList
      console.log("symbolList...", state.symbolList)
    });
};

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getAllCurrencyList();
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

const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getOrderList();
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
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

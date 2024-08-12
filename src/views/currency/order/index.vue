<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getOrderList"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="button-group">
      <!--<el-button type="primary" :icon="Plus" @click="orderCompensation()">赔付</el-button>-->
      <!--<el-button type="primary" :icon="Plus" @click="orderCompensation2()">快速赔付</el-button>-->
    </div>
    <el-table
      ref="filterTableRef1"
      size="small"
      stripe
      class="table-list"
      row-key="id"
      :data="state.tb1"
      style="width: 100%"
      v-loading="tableLoading"
      :row-class-name="tableRowClassName"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column prop="id" label="序号" width="40"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <!--<el-table-column prop="phone" label="手机号"> </el-table-column>-->
      <el-table-column prop="create_date" label="买入时间" width="80"> </el-table-column>
      <el-table-column prop="name" label="币种">
        <template #default="scope">
          {{scope.row.name}}({{scope.row.text}})
        </template>
      </el-table-column>
      <el-table-column prop="profit_status" label="订单类型">
        <template #default="scope">
          <span v-if="scope.row.buy_type==1">
            <el-tag v-if="scope.row.order_type==1" type="success">市价买入</el-tag>
            <el-tag v-else-if="scope.row.order_type==2" type="danger">市价卖出</el-tag>
          </span>
          <span v-else-if="scope.row.buy_type==2">
            <el-tag v-if="scope.row.order_type==1" type="success">限价买入</el-tag>
            <el-tag v-else-if="scope.row.order_type==2" type="danger">限价卖出</el-tag>
          </span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="profit_status" label="订单状态">
        <template #default="scope">
          <el-tag v-if="scope.row.order_status==1" type="warning">委托</el-tag>
          <el-tag v-else-if="scope.row.order_status==2" type="success">完成</el-tag>
          <el-tag v-else-if="scope.row.order_status==3" type="danger">已撤单</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="buy_price" label="下单价格(USDT)"> </el-table-column>
      <!--<el-table-column prop="final_price" label="成交价格(USDT)"> </el-table-column>-->
      <el-table-column prop="quantity" label="下单数量"> </el-table-column>
      <!--<el-table-column prop="final_quantity" label="成交数量"> </el-table-column>-->
      <el-table-column prop="fee" label="手续费"> </el-table-column>
      <el-table-column prop="deposit" label="总金额(USDT)"> </el-table-column>
      <!--<el-table-column prop="commission" label="收益(USDT)"> </el-table-column>-->
      <!--<el-table-column prop="profit_status" label="收益状态">-->
        <!--<template #default="scope">-->
          <!--<el-tag v-if="scope.row.profit_status==1" type="success">盈利</el-tag>-->
          <!--<el-tag v-else-if="scope.row.profit_status==2" type="danger">亏损</el-tag>-->
          <!--<span v-else></span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="sell_date" label="成交时间" width="80"> </el-table-column>
      <!--<el-table-column prop="compensation" label="赔付金额(USDT)">-->
        <!--<template #default="scope">-->
          <!--<el-tag v-if="scope.row.compensation!=''" type="success">{{scope.row.compensation}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="right">
        <template #default="scope">
            <el-button size="small" type="info" @click="handleEdit(scope.row)"
              >查看</el-button>
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
  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="getOrderList"
    @closeModal="isAddShow = false"
    :symbolList="state.symbolList"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="getOrderList"
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
import { ElMessage } from "element-plus";
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
  tb1: [],
  currentPage1: 1,
  pageSize1: 100,
  symbolList : [],
  selectIDS : [],
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
    {
      type: "select",
      key: "symbol_id", // 表单域model字段 必填
      placeholder: "币种",
      options: state.symbolList
    },
    {
      type: "select",
      key: "type", // 表单域model字段 必填
      placeholder: "盈利状态",
      options: [
        {
          value: 0,
          name: "全部",
        },
        {
          value: 1,
          name: "盈利",
        },
        {
          value: 2,
          name: "亏损",
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
  symbol_id:"",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getAllCurrencyList();
  getOrderList();
});

const selectChange = (selection) => {
  let _ids = []
  for (var i in selection) {
    _ids.push(selection[i]["id"])
  }
  state.selectIDS = _ids
  console.log("selection:", state.selectIDS)
}
const tableRowClassName = (e) => {
  let { row, rowIndex } = e;
  // console.log(row, rowIndex, store.state.app.userInfo.username);
  if (row.name == store.state.app.userInfo.username) {
    return "warning-row";
  }
  return "";
};

const orderCompensation2 = () => {
  $api.currency
    .orderCompensation2({
      ids : state.selectIDS.join(",")
    })
    .then((res) => {
      if (res.result) {
        ElMessage("快速赔付成功")
        getOrderList()
      }
    });
}

// methods
const getAllCurrencyList = () => {
  $api.currency
    .getAllCurrencyList({})
    .then((res) => {
      state.symbolList = res.data;
      formConfig.formItemList[3].options = state.symbolList
      console.log("symbolList...", state.symbolList)
    });
};

const getOrderList = () => {
  $api.currency
    .getOrderList({
      account : queryParam.account,
      phone : queryParam.phone,
      stype : queryParam.type,
      symbol_id : queryParam.symbol_id,
      start_time : queryParam.createTime[0],
      end_time : queryParam.createTime[1],
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.tb1 = res.data;
      state.total1 = res.count
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

const orderCompensation = () => {
  isAddShow.value = true;
}
const handleEdit = (row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
};
const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getCurrencyList();
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getCurrencyList();
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

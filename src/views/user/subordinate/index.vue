<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getSubordinateList"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>

    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">添加下属</el-button>
    </div>
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
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="account" label="账号"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="name" label="团队"> </el-table-column>
          <el-table-column prop="recharge" label="总充值金额(元)"></el-table-column>
          <el-table-column prop="withdraw" label="总提现金额(元)"></el-table-column>
          <el-table-column prop="recharge_usdt" label="总充值金额(USDT)"></el-table-column>
          <el-table-column prop="withdraw_usdt" label="总提现金额(USDT)"></el-table-column>
          <el-table-column prop="withdraw_wait" label="待提现金额(元)"></el-table-column>
          <el-table-column prop="withdraw_wait_usdt" label="待提现金额(USDT)"></el-table-column>
          <el-table-column prop="proxy_count" label="总代理人数"></el-table-column>
          <el-table-column prop="real_name_count" label="实名人数"></el-table-column>
          <el-table-column prop="parent" label="上级"></el-table-column>
          <el-table-column prop="root" label="顶级"></el-table-column>
          <!-- <el-table-column prop="uid" label="玩家ID"></el-table-column> -->
          <el-table-column align="right">
            <template #default="scope">
              <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
  </div>
  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="getSubordinateList"
    @closeModal="isAddShow = false"
  />
  <detail-modal
    v-if="isDetailShow"
    :addVisible="isDetailShow"
    @closeModal="isDetailShow = false"
    :uid="editInfo"
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
import addModal from "./module/add.vue";
import detailModal from "./module/detail.vue";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const router = useRouter();
const isAddShow = ref(false);
const isDetailShow = ref(false);
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tb1 : [],
});

onMounted(() => {
  getSubordinateList()
});

const getSubordinateList = () => {
  tableLoading.value = true;
  $api.proxy
    .getSubordinateList(queryParam)
    .then((res) => {
      state.tb1 = res.data;
      tableLoading.value = false;
    });
}

const handleDetail = (row) => {
  isDetailShow.value = true
  editInfo.value = row.uid
  console.log("editInfo.00..", editInfo)
}

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

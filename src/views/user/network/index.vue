<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="searchQuery"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>

    <el-descriptions
      class="margin-top"
      title="基本信息"
      :column="2"
      :size="size"
      border
    >

    <el-descriptions-item>
      <template #label><div class="cell-item">ID:</div></template>
      {{state.userinfo.id}}
    </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">账号:</div></template>
        {{state.userinfo.account}}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">手机号:</div></template>
        {{state.userinfo.phone}}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">上级:</div></template>
        {{state.userinfo.parent}}
      </el-descriptions-item>

        <el-descriptions-item>
          <template #label><div class="cell-item">团队成员:</div></template>
          <el-tag type="info" class="tag">{{state.userinfo.count}}人</el-tag>
          <!-- <el-tag type="warnin" class="tag">总充值(元):{{state.userinfo.recharge}}</el-tag>
          <el-tag type="success" class="tag">总提现(元):{{state.userinfo.withdraw}}</el-tag>
          <el-tag type="danger" class="tag">总结余(元):{{state.userinfo.jieyu}}</el-tag> -->
          {{state.userinfo.root_user_id}}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

    <el-tabs type="border-card">
      <el-tab-pane label="一级代理">
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
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="account" label="账号"> </el-table-column>
        <el-table-column prop="balance" label="余额"> </el-table-column>
        <el-table-column prop="recharge" label="充值金额"> </el-table-column>
        <el-table-column prop="withdraw" label="提现金额"> </el-table-column>
        <el-table-column prop="state" label="账户状态">
          <template #default="scope">
            <el-tag v-if="scope.row.state==1" effect="dark" color="green" round type="success">正常</el-tag>
            <el-tag v-else effect="dark" color="red" round type="danger">冻结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_date" label="注册时间"> </el-table-column>
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
      <el-tab-pane label="其他代理">
        <el-table
          ref="filterTableRef3"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb3"
          style="width: 100%"
          v-loading="tableLoading"
        >
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="account" label="账号"> </el-table-column>
        <el-table-column prop="balance" label="余额"> </el-table-column>
        <el-table-column prop="recharge" label="充值金额"> </el-table-column>
        <el-table-column prop="withdraw" label="提现金额"> </el-table-column>
        <el-table-column prop="state" label="账户状态">
          <template #default="scope">
            <el-tag v-if="scope.row.state==1" effect="dark" color="green" round type="success">正常</el-tag>
            <el-tag v-else effect="dark" color="red" round type="danger">冻结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="层级"> </el-table-column>
        <el-table-column prop="create_date" label="注册时间"> </el-table-column>
        </el-table>
        <el-pagination
            v-model:currentPage="state.currentPage3"
            v-model:page-size="state.pageSize3"
            :page-sizes="[20, 100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total3"
            background
            @size-change="handleSizeChange3"
            @current-change="handleCurrentChange3"
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
import codeModal from "@/components/googleCode/index.vue";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const filterTableRef = ref();
const tableLoading = ref(true);
const state = reactive({
  userinfo : {},

  tb1 : [],
  currentPage1 : 1,
  pageSize1 : 20,
  total1 : 0,

  tb2 : [],
  currentPage2 : 1,
  pageSize2 : 20,
  total2 : 0,

  tb3 : [],
  currentPage3 : 1,
  pageSize3 : 20,
  total3 : 0,
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
    // { type: "input", placeholder: "手机号", key: "phone" },
  ],
});
const queryParam = reactive({
  //搜索表单
  account: "",
});

onMounted(() => {
  tableLoading.value = false
});

const searchQuery = () => {
  getNetworkInfo()
}

// methods
const getNetworkInfo = () => {
  $api.proxy
    .getNetworkInfo(queryParam)
    .then((res) => {
      state.userinfo = res.data;
      getUserInviteList(1)
      getUserInviteList(3)
    });
};

const getUserInviteList = (lv) => {
  if (lv == 1) {
    $api.proxy
      .getUserInviteList({
        uid : state.userinfo.id,
        page : state.currentPage1,
        size : state.pageSize1,
        stype : 1,
      }).then((res) => {
        state.tb1 = res.data
        state.total1 = res.count
      })
  } else {
    $api.proxy
      .getUserInviteList({
        uid : state.userinfo.id,
        page : state.currentPage3,
        size : state.pageSize3,
        stype : 3,
      }).then((res) => {
        state.tb3 = res.data
        state.total3 = res.count
      })
  }
}

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
const handleSizeChange3 = (val) => {
  state.pageSize3 = val;
  state.currentPage3 = 1;
  getUserInviteList(3);
};
const handleCurrentChange3 = (val) => {
  state.currentPage3 = val;
  getUserInviteList(3);
};

const handleSizeChange2 = (val) => {
  state.pageSize2 = val;
  state.currentPage2 = 1;
  getUserInviteList(2);
};
const handleCurrentChange2 = (val) => {
  state.currentPage2 = val;
  getUserInviteList(2);
};

const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getUserInviteList(1);
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getUserInviteList(1);
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
  padding: 15px;
  .tag {
    margin: 5px;
  }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

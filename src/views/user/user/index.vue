<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getPlayersList"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="flex">
      <el-button type="warning" @click="alterParent">修改上级</el-button>
      <el-button type="warning" @click="frozen">冻结/解冻下级账户</el-button>
      <el-button type="warning" @click="frozenAccount">冻结/解冻下级资金</el-button>
    </div>
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
      <el-table-column prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="state" label="账户状态">
        <template #default="scope">
          <el-tag v-if="scope.row.state==1" effect="dark" color="green" round type="success">正常</el-tag>
          <el-tag v-else effect="dark" color="red" round type="danger">冻结</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="account_state" label="资金状态">
        <template #default="scope">
          <el-tag v-if="scope.row.account_state==0" effect="dark" color="green" round type="success">正常</el-tag>
          <el-tag v-else effect="dark" color="red" round type="danger">冻结</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="HKD" label="账户资产(HKD)"> </el-table-column>
      <el-table-column prop="USD" label="账户资产(USD)"> </el-table-column>
      <el-table-column prop="leverage" label="杠杆倍数"> </el-table-column>
      <!-- <el-table-column prop="CNY" label="CNY"> </el-table-column> -->
      <!-- <el-table-column prop="USD" label="USD"> </el-table-column> -->
      <!-- <el-table-column prop="HKD" label="HKD"> </el-table-column> -->
      <!-- <el-table-column prop="RZ_CNY" label="融资CNY"> </el-table-column> -->
      <!-- <el-table-column prop="RZ_USD" label="融资USD"> </el-table-column> -->
      <!-- <el-table-column prop="RZ_HKD" label="融资HKD"> </el-table-column> -->
      <el-table-column prop="parent" label="上级账户"> </el-table-column>
      <el-table-column prop="root" label="顶级账户"> </el-table-column>
      <el-table-column prop="ip" label="注册IP"> </el-table-column>
      <el-table-column prop="create_date" label="注册时间"> </el-table-column>
      <el-table-column prop="last_login_tim" label="最后登录时间"> </el-table-column>
      <el-table-column prop="open_status" label="是否开户">
        <template #default="scope">
          <el-tag v-if="scope.row.open_status==0 || !scope.row.open_status" effect="dark" color="red" round type="success">未开户</el-tag>
          <el-tag v-if="scope.row.open_status==1" effect="dark" color="blue " round type="danger">待审核</el-tag>
          <el-tag v-if="scope.row.open_status==2" effect="dark" color="green" round type="danger">已开户</el-tag>

        </template>
      </el-table-column>

      <el-table-column align="right" width="300">
        <template #default="scope">
          <el-button size="small" @click="handleDetail(scope.row)"
            >查看详情</el-button
          >
          <el-button size="small" @click="handleAuth(scope.row.id, scope.row.account)"
            >（审核消息）</el-button>

            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定重置提现密码吗？"
              @confirm="handleReset(scope.row.id)"
            ><template #reference>
              <el-button size="small" type="danger">重置提现密码</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <detail-modal
    v-if="isDetailShow"
    :addVisible="isDetailShow"
    @updateList="getUsersList"
    @closeModal="closeShow"
    :info="editInfo"

  />
  <auth-modal
    v-if="isAuthShow"
    :addVisible="isAuthShow"
    @closeModal="closeShow"
    :info="editInfo"
  />
  <alterParent-modal
    v-if="isAlterParentShow"
    :addVisible="isAlterParentShow"
    @closeModal="closeShow"
  />

  <frozen-modal
    v-if="isFrozenShow"
    :addVisible="isFrozenShow"
    @closeModal="closeShow"
  />

  <frozenAccount-modal
    v-if="isFrozenAccountShow"
    :addVisible="isFrozenAccountShow"
    @closeModal="closeShow"
  />

  <el-pagination
      v-model:currentPage="state.currentPage"
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
import detailModal from "./module/detail.vue";
import authModal from "./module/auth.vue";
import alterParentModal from "./module/alterParent.vue";
import frozenModal from "./module/frozen.vue";
import frozenAccountModal from "./module/frozenAccount.vue";
import mixin from "@/mixins/list.js";
import codeModal from "@/components/googleCode/index.vue";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;

const isDetailShow = ref(false);
const isAuthShow = ref(false);
const isAlterParentShow = ref(false);
const isFrozenShow = ref(false);
const isFrozenAccountShow = ref(false);
const router = useRouter();

const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  total:0,
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
    { type: "input", placeholder: "ip", key: "ip" },
    { type: "input", placeholder: "账户尾号", key: "phone" },
    { type: "input", placeholder: "真实姓名", key: "name" },
    { type: "input", placeholder: "身份证", key: "idcard" },
  ],
});
const queryParam = reactive({
  //搜索表单
  account: "",
  ip: "",
  phone: "",
  name: "",
  idcard: "",
});

const editInfo = ref();
onMounted(() => {
  getPlayersList();
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
const closeShow = () => {
  isFrozenAccountShow.value = false;
  isFrozenShow.value = false;
  isAlterParentShow.value = false;
  isAuthShow.value = false;
  isDetailShow.value = false;
  getPlayersList();
}

const getPlayersList = () => {
  tableLoading.value = false;
  // $api.player
  //   .playerQry({
  //     size: state.pageSize,
  //     page: state.currentPage,
  //     account : queryParam.account,
  //     ip : queryParam.ip,
  //     phone : queryParam.phone,
  //     name : queryParam.name,
  //     idcard : queryParam.idcard,
  //   })
  //   .then((res) => {
  //     state.tableData = res.data;
  //     state.total = res.count
  //     console.log("getUsersList", res);
  //     tableLoading.value = false;
  //   });
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
const handleDetail = (item) => {
  // eslint-disable-next-line no-console
  console.log('handleDetail',item);
  isDetailShow.value = true;
  editInfo.value = item;
};

const handleAuth = (uid, account) => {
  // eslint-disable-next-line no-console
  isAuthShow.value = true;
  editInfo.value = [uid, account];
};

const alterParent = () => {
  isAlterParentShow.value = true;
}

const frozen = () => {
  isFrozenShow.value = true;
}

const frozenAccount = () => {
  isFrozenAccountShow.value = true;
}

const handleReset = (uid) => {
  $api.player
    .resetWithdrawPwd({
      uid: uid
    })
    .then((res) => {
      ElMessage('操作成功')
    });
}

const handleSizeChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  state.currentPage = 1;
  getPlayersList();
  // request api to change tableData
};
const handleCurrentChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  getPlayersList();
  // request api to change tableData
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

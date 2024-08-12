<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="follow.getCurrencyList"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button
          v-if="scope.row.is_online == 1"
          size="small"
          type="danger"
          @click="handleOnLine(scope.row)"
          >下线</el-button
        >
        <el-button
          v-else
          size="small"
          type="warning"
          @click="handleOnLine(scope.row)"
          >上线</el-button
        >

        <el-button size="small" type="info" @click="handleEdit(scope.row)"
          >编辑</el-button
        >

        <el-button
          v-if="scope.row.is_recommend == 1"
          size="small"
          type="danger"
          @click="handleRecommend(scope.row)"
          >取消推荐</el-button
        >
        <el-button
          v-else
          size="small"
          type="warning"
          @click="handleRecommend(scope.row)"
          >推荐</el-button
        >
      </slot>
      <slot v-if="scope.row && scope.row.key == 'icon'">
        <img
          :src="$imgeUrl + scope.row.icon"
          alt
          style="max-height: 50px"
          width="50"
        />
      </slot>
      <slot v-if="scope.row && scope.row.key == 'is_recommend'">
        <el-tag v-if="scope.row.is_recommend == 1" type="success">是</el-tag>
        <el-tag v-else type="danger">否</el-tag>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'percent_json'">
        {{ getHour(scope.row.percent_json) }}
      </slot>

      <slot v-if="scope.row && scope.row.key == 'is_online'">
        <el-tag v-if="scope.row.is_online == 1" type="success">上线</el-tag>
        <el-tag v-else type="danger">下线</el-tag>
      </slot>
    </template>
    <template #leftView>
      <el-button type="primary" @click="isAddShow = true">新建币种</el-button>
    </template>
  </table-modal>

  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false"
    :info="editInfo"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="$upTableList(tableRef)"
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
import detailModal from "./module/detail.vue";
import addModal from "./module/add.vue";
import editModal from "./module/edit.vue";

import mixin from "@/mixins/list.js";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import FileSaver from "file-saver";
import * as XLSX from "xlsx"; //这是vue3导入XLSX的方法
import XLSXS from "xlsx-js-style";
const { num, exportExcel } = mixin();
const { $api, $upTableList } =
  getCurrentInstance().appContext.config.globalProperties;
const tableRef = ref();
const isDetailShow = ref(false);
const isAuthShow = ref(false);
const isAlterParentShow = ref(false);
const isFrozenShow = ref(false);
const isFrozenAccountShow = ref(false);
const router = useRouter();
const editInfo = ref();
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  total: 0,
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});
const ExportLoading = ref(false);
const isAddShow = ref(false);
const isEditShow = ref(false);
const handleEdit = (row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
};
const column = [
  { title: "序号", key: "c_index" },
  { title: "图标", key: "icon", isNeedSlot: true },
  { title: "币种", key: "name" },
  { title: "火币K线", key: "base" },
  { title: "手续费%", key: "fee_percent" },
  { title: "跟单规模", key: "deposit" },
  { title: "开放笔数", key: "max_count" },
  { title: "剩余笔数", key: "able_count" },
  { title: "交易次数", key: "buy_count" },
  { title: "交易周期(小时)", key: "percent_json", isNeedSlot: true },
  { title: "开仓时间", key: "open_time" },

  { title: "推荐", key: "is_recommend", isNeedSlot: true },
  { title: "是否上线", key: "is_online", isNeedSlot: true },
  { title: "4", key: "edit_row", width: 300 },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "账号", key: "account" },
    { type: "input", placeholder: "ip", key: "ip" },
  ],
});
const queryParam = reactive({
  //搜索表单
  account: "",
  ip: "",
});

onMounted(() => {
  // getPlayersList();
});
const getHour = (obj) => {
  obj = JSON.parse(obj);
  let t = obj[0].second / 3600;
  return t;
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
//导表
const exportFile = () => {
  ElMessageBox.confirm("是否确认导出表格数据?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      exportList(state.tableData);
    })
    .catch((err) => {
      ElMessage({
        type: "info",
        message: err,
      });
    });
};
const handleOnLine = (row) => {
  $api.follow
    .onlineCurrency({
      id: row.id,
      state: row.is_online == 1 ? 0 : 1,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
};

const handleRecommend = (row) => {
  $api.follow
    .recommend({
      id: row.id,
      state: row.is_recommend == 1 ? 0 : 1,
    })
    .then((res) => {
      $upTableList(tableRef.value);
    });
};
const exportList = () => {
  ExportLoading.value = true;
  $api.player
    .playerQry({
      size: state.total > 10000 ? 10000 : state.total,
      page: 1,
      account: queryParam.account,
      ip: queryParam.ip,
      phone: queryParam.phone,
      sorttype: queryParam.sorttype,
    })
    .then((res) => {
      const newArr = res.data;
      newArr.forEach((item) => {
        let { state, vip_lv, online } = item;
        item.state = state == 1 ? "正常" : "冻结";
        item.vip_lv = vip_lv == 0 ? "普通用户" : `VIP. ${item.vip_lv}`;
        item.online = online == 1 ? "在线" : "离线";
      });
      const headType = {
        id: "id",
        account: "账号",
        phone: "手机号",
        state: "账户状态",
        ip: "注册IP",
        reg_date: "注册时间",
        coin: "金币",
        points: "积分",
        recharge: "充值金额",
        recharge_usdt: "充值USDT",
        parent: "上级",
        root: "顶级",
        vip_lv: "VIP",
        lv: "层级",
        online: "在线状态",
      };
      let column = [];
      //获取字段名，生成字段名数组
      const keys = Object.keys(newArr[0]);
      keys.forEach((item) => {
        if (headType[item]) {
          let obj = {
            title: headType[item],
            key: item,
          };
          column.push(obj);
        }
      });
      exportExcel("玩家列表", newArr, column);
      ExportLoading.value = false;
    });
};
const getPlayersList = () => {
  $api.player
    .playerQry({
      size: state.pageSize,
      page: state.currentPage,
      account: queryParam.account,
      ip: queryParam.ip,
      phone: queryParam.phone,
      sorttype: queryParam.sorttype,
      start_time: queryParam.createTime[0],
      end_time: queryParam.createTime[1],
    })
    .then((res) => {
      state.tableData = res.data;
      state.total = res.count;
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
const handleDetail = ({ id, account }) => {
  // eslint-disable-next-line no-console
  isDetailShow.value = true;
  editInfo.value = { uid: id, account };
};

const handleAuth = (uid, account) => {
  // eslint-disable-next-line no-console
  isAuthShow.value = true;
  editInfo.value = [uid, account];
};

const alterParent = () => {
  isAlterParentShow.value = true;
};

const frozen = () => {
  isFrozenShow.value = true;
};

const frozenAccount = () => {
  isFrozenAccountShow.value = true;
};

const handleReset = (uid) => {
  $api.player
    .resetWithdrawPwd({
      uid: uid,
    })
    .then((res) => {
      ElMessage("操作成功");
    });
};

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
  // .table-list {
  //   margin: 15px;
  // }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

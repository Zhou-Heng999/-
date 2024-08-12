<template>
  <table-modal
    :tableHeader="column"
    :valueForm="queryParam"
    tableUrl="users.userQry"
    ref="tableRef"
    @searchReset="searchReset"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'Tag_Profile_IM_Gender'">
        <div>{{ genderList[scope.row.Tag_Profile_IM_Gender] }}</div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'status'">
        <el-tag v-if="scope.row.status == 1" round type="success">正常</el-tag>
        <el-tag v-if="scope.row.status == 0" round type="danger">禁用</el-tag>
        <!-- <div>{{ statusList[scope.row.status] }}</div> -->
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-popconfirm
          v-if="scope.row.status == 1"
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定封禁该账号吗？"
          @confirm="handleBan(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button size="small" type="danger">禁用账号</el-button>
          </template>
        </el-popconfirm>
        <el-button
          v-if="scope.row.status == 0"
          type="primary"
          size="small"
          @click="handleBan(scope.$index, scope.row)"
          >解除封禁</el-button
        >
      </slot>
    </template>

    <template #leftView>
      <el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >添加用户</el-button
      >
    </template>
  </table-modal>

  <add-modal
    :addVisible="isAddShow"
    :roleData="state.roles"
    @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    :roleData="state.roles"
    @updateList="$upTableList(tableRef)"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
  <code-modal
    @closeModal="isCodeShow = false"
    @confrim="confrimCode"
    :dialogVisible="isCodeShow"
  />
  <!-- <edit-psw
    v-if="isPswShow"
    :addVisible="isPswShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isPswShow = false"
    :info="editInfo"
  /> -->
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
// import editModal from "./module/edit.vue";
// import editPsw from "./module/editPsw.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
import codeModal from "@/components/googleCode/index.vue";
const { num, setTimestamp } = mixin();
const { proxy } = getCurrentInstance();
// const { timestampToTime } = util();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isBatchShow = ref(false);
const isEditShow = ref(false);
const isPswShow = ref(false);
const router = useRouter();
const isCodeShow = ref(false);
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 100,
  search: "",
  roles: [],
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const column = [
  { title: "编号", key: "id" },
  { title: "账号", key: "account" },
  { title: "昵称", key: "nick" },
  { title: "父级编号", key: "pid" },
  { title: "父级账号", key: "pnick" },
  { title: "父级昵称", key: "paccount" },
  { title: "角色", key: "role_name" },
  { title: "注册时间", key: "created_at", keyType: "time", width: 90 },
  { title: "修改时间", key: "updated_at", keyType: "time", width: 90 },
  { title: "最近登录时间", key: "login_time", keyType: "time", width: 90 },
  { title: "最近登录IP", key: "login_ip" },
  { title: "允许登录IP", key: "ip_whitelist" },
  { title: "状态", key: "status", isNeedSlot: true },
  { title: "操作", key: "edit_row", isNeedSlot: true, width: 150 },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "用户昵称模糊查询", key: "nick", width: 200 },
    {
      type: "input",
      placeholder: "请输入用户账号",
      key: "account",
      width: 200,
    },
    {
      type: "datetimerange",
      key: ["start_time", "end_time"],
      placeholder: ["开始时间", "结束时间"],
    },
    {
      type: "select",
      key: "role_id", // 表单域model字段 必填
      placeholder: "角色",
      options: [],
      account: "",
      role_id: "",
    },
    // {
    //   type: "select",
    //   key: "channel", // 表单域model字段 必填
    //   placeholder: "渠道",
    //   options: [],
    // },
  ],
});
const queryParam = reactive({
  //搜索表单
  account: "",
  role_id: "",
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  // getChannelList()
    getRolesList();
  // getTag();
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

const searchReset = () => {
  queryParam["start_time,end_time"] = [0, 0];
};

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};
const clearGoogle = (id) => {
  codeType.value = "clear";
  rowUserId.value = id;
  isCodeShow.value = true;
};
const handleOnline = (index, row) => {
  $api.channel
    .online({
      id: row.id,
      status: row.status == 0 ? 1 : 0,
    })
    .then((res) => {
      up();
    });
};

const getRolesList = () => {
  $api.roles
    .roleQry({
      size: "500",
      page: "1",
    })
    .then((res) => {
      state.roles = res.data.list;
      let rolesList = []
      state.roles.forEach(itm=>{
        rolesList.push({
          label: itm.name,
          value: itm.id
        })
      })
      formConfig.formItemList[1].options = rolesList;
      console.log("1212121212",rolesList);
      console.log("getRolesList", res);
    });
};

const getTag = () => {
  $api.dictionary
    .list({
      size: "100",
      page: "1",
    })
    .then((res) => {
      console.log("res", res);
      // let a = res.data.find((item) => item.type == "CURRENCY_CODE");
      // state.tagData = a.itemList;
      // console.log("tagData", state.tagData);
    });
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
// 修改用户状态
const handleBan = (index, row) => {
  console.log(row);
  $api.users
    .userDelete({
      idx: row.id,
      state: row.status == 1 ? 0 : 1,
    })
    .then((res) => {
      up();
    });
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

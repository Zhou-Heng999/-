<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="appUser.list"
    :isCheckMore="true"
    ref="tableRef"
    @searchReset="searchReset"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'Tag_Profile_IM_Gender'">
        <div>{{ genderList[scope.row.Tag_Profile_IM_Gender] }}</div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'status'">
        <el-tag v-if="scope.row.status == 1" round type="success">正常</el-tag>
        <el-tag v-if="scope.row.status == 2" round type="danger">禁用</el-tag>
        <!-- <div>{{ statusList[scope.row.status] }}</div> -->
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >查看</el-button
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
          v-if="scope.row.status == 2"
          type="primary"
          size="small"
          @click="handleBan(scope.$index, scope.row)"
          >解除封禁</el-button
        >
      </slot>
    </template>

    <template #leftView>
      <el-button type="primary" @click="isAddShow = true">单个添加</el-button>
      <el-button type="primary" @click="isBatchShow = true">批量导入</el-button>
       <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定批量封禁账号吗？"
          @confirm="del(tableRef)"
        >
          <template #reference>
            <el-button size="primary" type="danger">批量禁用</el-button>
          </template>
        </el-popconfirm>
    </template>
  </table-modal>

  <add-modal
    :addVisible="isAddShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
  <add-batch
    v-if="isBatchShow"
    :addVisible="isBatchShow"
    @updateList="$upTableList(tableRef)"
    @closeModal="isBatchShow = false"
  ></add-batch>

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
import editModal from "@/components/userDetail/index.vue";
import addBatch from "./module/addBatch.vue";
// import editModal from "./module/edit.vue";
// import editPsw from "./module/editPsw.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const { num } = mixin();
// const { timestampToTime } = util();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isBatchShow = ref(false);
const isEditShow = ref(false);
const isPswShow = ref(false);
const router = useRouter();
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  search: "",
  tagData: [],
  total: 0,
  channelList: [],
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);
const genderList = ref({
  Gender_Type_Unknown: "未设置",
  Gender_Type_Male: "男",
  Gender_Type_Female: "女",
});

const statusList = ref({
  2: "禁用",
  1: "正常",
});

const column = [
  { title: "id", key: "id" },
  { title: "渠道", key: "channel" },
  { title: "昵称", key: "Tag_Profile_IM_Nick" },
  { title: "性别", key: "Tag_Profile_IM_Gender", isNeedSlot: true },
  { title: "账号", key: "account" },
  // { title: "密码", key: "password" },
  // { title: "登录IP", key: "login_ip" },
  { title: "绑定手机", key: "phone" },
  // { title: "手机绑定时间", key: "phone_bind_time", keyType: 'time' },
  // { title: "登录时间", key: "login_time", width:90 },
  { title: "注册时间", key: "reg_time", keyType: "time", width: 90 },
  { title: "状态", key: "status", isNeedSlot: true },
  { title: "操作", key: "edit_row", width: 180 },
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
  // name: "",
  nick: "",
  account: "",
  start_time: "",
  end_time: "",
  channel: "",
  virtual: "1",
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getChannelList();
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
const del = (row) => {
  let data = row.getCheckMoreList();
  console.log(data);
  if(data.length != 0){

  }else{
    ElMessage({
      message: "请选择",
      type: "warning",
    });
  }
  // state.delVisible = true;
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

//获取渠道列表
const getChannelList = () => {
  $api.channel
    .list({
      size: 200,
      page: 1,
    })
    .then((res) => {
      // console.log("getChannelList", res.data.list);
      let data = [];
      res.data.list.forEach((item) => {
        data.push({
          value: item.code,
          label: item.name,
        });
      });
      formConfig.formItemList[3].options = data;
      // console.log("formConfig", formConfig);
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
  let info = {
    account: row.userID,
  };
  editInfo.value = info;

  //选中的
  // let list = proxy.$refs["tableRef"].getCheckMoreList();
  // console.log(list)
};
// 修改用户状态
const handleBan = (index, row) => {
  console.log(row);
  $api.appUser
    .modify_status({
      // id: row.id,
      account: row.userID,
      status: row.status == 1 ? 2 : 1,
    })
    .then((res) => {
      ElMessage({
        type: "success",
        showClose: true,
        message: "操作成功",
      });
      up();
      // state.tableData.splice(index, 1);
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

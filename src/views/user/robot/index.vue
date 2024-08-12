<template>
  <table-modal :tableHeader="column" tableUrl="appRobot.list" ref="tableRef">
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'faceurl'">
          <el-image v-if="scope.row.faceurl" style="width: 100px; height: 100px" :src="scope.row.faceurl" fit="scale-down" />
      </slot>

      <slot v-if="scope.row && scope.row.key == 'status'">
        <div>{{ statusList[scope.row.status] }}</div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'userID'">
        <el-link type="primary" @click="showUserDetail(scope.row.userID)">{{ scope.row.userID }}</el-link>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <multipleBtn width="350">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="modifyStatus(scope.$index, scope.row)" :type="scope.row.status == 1 ?'danger':'primary'">{{ scope.row.status == 1 ? '下线' :
            '上线' }}</el-button>
          <!-- <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="确定删除吗？" @confirm="handleDel(scope.$index, scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm> -->
        </multipleBtn>

      </slot>
    </template>
    <template #leftView>
      <el-button type="primary" @click="isAddShow = true">添加</el-button>
    </template>

  </table-modal>

  <add-modal v-if="isAddShow" :addVisible="isAddShow" :tagData="tagData" @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false" />
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
import addModal from "./module/add.vue";
// import editModal from "@/components/userDetail/index.vue";
import editModal from "./module/edit.vue";
import { watch } from "@vue/runtime-core";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const { num } = mixin();
// const { timestampToTime } = util();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const isPswShow = ref(false);
const isMuteShow = ref(false);
const isFriendsShow = ref(false);
const isDetailShow = ref(false)
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
  channelList: []
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);

const statusList = ref({
  '2': '下线',
  '1': '上线',
})

const column = [
  { title: "id", key: "id" },
  { title: "渠道", key: "channel" },
  { title: "账号", key: "account" },
  { title: "账号ID", key: "userID", isNeedSlot: true },
  { title: "昵称", key: "nick" },
  { title: "个性签名", key: "signature" },
  { title: "头像", key: "faceurl", isNeedSlot: true, width: 110 },
  { title: "注册时间", key: "reg_time", keyType: 'time', width: 90 },
  { title: "状态", key: "status", isNeedSlot: true },
  { title: "类型", key: "type", typeList: 'Robot_Type' },
  { title: "操作", key: "edit_row" },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "用户昵称模糊查询", key: "nick", width: 200 },
    { type: "input", placeholder: "请输入用户ID", key: "account", width: 200 },
    {
      type: "datetimerange",
      key: ["start_time", "end_time"],
      placeholder: ["开始时间", "结束时间"],
    },
    {
      type: "select",
      key: "channel", // 表单域model字段 必填
      placeholder: "类型",
      options: [],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  name: "",
  nick: "",
  account: "",
  start_time: "",
  end_time: "",
  channel: "",
  virtual: "0" //真实用户
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  // getChannelList()
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

const showUserDetail = (account) => {
  // let info = {
  //   account: account
  // }
  // editInfo.value = info;
  // isDetailShow.value = true;
}

const up = () => {
  proxy.$refs["tableRef"].getTableList();
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
      console.log("getChannelList", res.data.list);
      let data = [];
      res.data.list.forEach(item => {
        data.push({
          value: item.code,
          label: item.name
        })
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
  editInfo.value = row;
};

// 修改用户状态
const modifyStatus = (index, row) => {
  // console.log(row)
  $api.appRobot
    .modify_status({
      account: row.userID,
      status: row.status == 1 ? 2 : 1
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

const handleDel = (index, row) => {
  // console.log(row)
  $api.appRobot
    .modify_status({
      account: row.userID,
      status: row.status == 1 ? 2 : 1
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

watch(
  () => isDetailShow.value,
  (val) => {
    if (val) {
      // console.log(val)
      // up();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

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

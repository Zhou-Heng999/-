<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="chatGroup.list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'member'">
        <el-link type="primary" @click="checkMember(scope.$index, scope.row)">查看</el-link>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'history'">
        <el-link type="primary" @click="checkHistory(scope.$index, scope.row)">查看</el-link>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'billLog'">
        <el-link type="primary" @click="checkBillLog(scope.$index, scope.row)">查看</el-link>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'Operator_Account'">
          <el-link type="primary" @click="showUserDetail(scope.row.Operator_Account)">{{scope.row.Operator_Account}}</el-link>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'Owner_Account'">
          <el-link type="primary" @click="showUserDetail(scope.row.Owner_Account)">{{scope.row.Owner_Account}}</el-link>
      </slot>


      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        
        <multipleBtn>
          
              <el-button
                size="small"
                type="primary"
                @click="sendSystem(scope.$index, scope.row)"
                >系统通知</el-button
              >

              <el-button size="small" @click="handleSend(scope.$index, scope.row)"
                  >发送消息</el-button
                >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定清空历史消息吗？"
                @confirm="clearHistory(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="danger">清空历史</el-button>
                </template>
              </el-popconfirm>
              
              <el-button size="small" type="danger" @click="handleAllMute(scope.$index, scope.row)"
                >{{scope.row.MuteAllMember=='Off'? '全员禁言':'关闭禁言'}}</el-button
              >
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定解散该群吗？"
                @confirm="handleDissolve(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="danger">解散</el-button>
                </template>
              </el-popconfirm>
        
        </multipleBtn>
        
      </slot>
    </template>
  </table-modal>

  <!-- <add-modal
    :addVisible="isAddShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false"
  /> -->
  <send-modal
    v-if="isShowSend"
    :addVisible="isShowSend"
    :tagData="tagData"
    @closeModal="isShowSend = false"
    :info="sendInfo"
  />

  <sendSystemModal
    v-if="isShowSystem"
    :addVisible="isShowSystem"
    :tagData="tagData"
    @closeModal="isShowSystem = false"
    :info="sendInfo"
  ></sendSystemModal>

  <memberModal
    v-if="isShowMember"
    :addVisible="isShowMember"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isShowMember = false"
    :info="memberInfo"
  ></memberModal>

  <detailModal
    v-if="isDetailShow"
    :addVisible="isDetailShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isDetailShow = false"
    :info="editInfo"
  ></detailModal>

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
// import addModal from "./module/add.vue";
import sendModal from "./module/sendMsg.vue";
import sendSystemModal from "./module/sendSystem.vue";
import memberModal from "./module/member.vue";
import multipleBtn from "@/components/multipleBtn/index.vue"
import detailModal from "@/components/userDetail/index.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
import { Delete, View, Edit } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();
const { num } = mixin();
// const { timestampToTime } = util();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const isShowSend = ref(false);
const isShowSystem = ref(false);
const isShowMember = ref(false);
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
  channelList: [],
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);

const column = [
  { title: "群ID", key: "GroupId" },
  { title: "群名", key: "Name" },
  { title: "群成员", key: "member", isNeedSlot: true },
  { title: "用户总数", key: "MemberNum"},
  { title: "真实用户", key: "RealNum"},
  { title: "虚拟用户", key: "VirtualNum"},
  { title: "发起账号", key: "Operator_Account", isNeedSlot: true },
  { title: "群主", key: "Owner_Account", isNeedSlot: true },
  // { title: "群组类型", key: "Type" },
  { title: "时间", key: "EventTime", keyType: "time",width: 90 },
  // { title: "群自定义字段", key: "UserDefinedDataList" },
  { title: "渠道", key: "channel" },
  { title: "历史消息", key: "history", isNeedSlot: true },
  { title: "账单", key: "billLog", isNeedSlot: true },
  // { title: "", key: "systemMsg", isNeedSlot: true },
  // { title: "", key: "clear", isNeedSlot: true, width:180 },
  { title: "操作", key: "edit_row", isNeedSlot: true, },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "群名称", key: "name", width: 200 },
    { type: "input", placeholder: "群ID", key: "groupId", width: 200 },
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
  name: "",
  groupId: "",
  start_time: "",
  end_time: "",
  channel: "",
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
const sendInfo = ref();
const memberInfo = ref();
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

const showUserDetail = (account) => {
    let info = {
        account: account
    }
    editInfo.value = info;
    isDetailShow.value = true;

}

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};

// 清空历史数据
const clearHistory = (index, row) => {
  $api.groupmsg
    .clear_group_msg({
      groupId: row.GroupId,
      // msgseq: '',
    })
    .then((res) => {
      // up();
      ElMessage({
        type: "success",
        showClose: true,
        message: "清空历史成功",
      });
    });
};

//解散群聊
const handleDissolve =(index, row) =>{
  $api.chatGroup
    .destroy_group({
      groupId: row.GroupId,
      // msgseq: '',
    })
    .then((res) => {
      up();
      ElMessage({
        type: "success",
        showClose: true,
        message: "解散成功",
      });
    });
}

//群体禁言
const handleAllMute =(index, row) =>{
  $api.chatGroup
    .forbid_group_all_member({
      groupId: row.GroupId,
      muteAllMember: row.MuteAllMember=='Off'? 'On':'Off'
    })
    .then((res) => {
      up();
      ElMessage({
        type: "success",
        showClose: true,
        message: "操作成功",
      });
    });
}

// 发送消息
const handleSend = (idx, row) => {
  isShowSend.value = true;
  sendInfo.value = row;
};

// 发送系统消息
const sendSystem = (idx, row) => {
  isShowSystem.value = true;
  sendInfo.value = row;
};

// 查看群成员
const checkMember = (idx, row) => {
  // console.log(row);
  isShowMember.value = true;
  memberInfo.value = row;
};

// 查看群账单
const checkBillLog = (idx, row) => {
  router.push('/group/billLog')
  store.commit('app/setGroupId',row.GroupId)
};

// 查看群历史记录
const checkHistory = (idx, row) => {
  router.push('/message/groupMsg')
  store.commit('app/setGroupId',row.GroupId)
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
  editInfo.value = row;
};
// 删除
const handleDelete = (index, row) => {
  console.log(row);
  $api.channel
    .del({
      id: row.id,
    })
    .then((res) => {
      ElMessage({
        type: "success",
        showClose: true,
        message: "删除成功",
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

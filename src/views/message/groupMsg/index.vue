<template>
  <table-modal
    v-if="state.isShowTable"
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="groupmsg.list"
    @searchReset="searchReset"
    ref="tableRef"
  >
    <template #default="scope">

      <slot v-if="scope.row && scope.row.key == 'From_Account'">
          <el-link type="primary" @click="showUserDetail(scope.row.From_Account)">{{scope.row.From_Account}}</el-link>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'MsgBody'">
        <div class="msg-body">
          <div class="msgClass">
            <div v-if="scope.row.MsgType=='TIMImageElem'">
              <el-image style="width: 140px; height: 100px" :src="setImg(scope.row.MsgBody)" fit="contain" />
            </div>
            <div v-else class="msg-text">{{ scope.row.MsgType=='TIMTextElem'? (JSON.parse(scope.row.MsgBody)).Text : '[非文本消息]' }}</div>
          </div>
          <p style="color: #3375b9;cursor: pointer;" @click="checkMsg(scope.$index, scope.row)">查看</p>
        </div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'MsgType'">
        <div>
          {{ msgTypeList[scope.row.MsgType] }}
        </div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" type="primary" :disabled="scope.row.MsgType!='TIMTextElem'" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        
        <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        title="确定删除该消息吗？"
        @confirm="handleDelete(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </slot>

      <!-- <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" @click="handleAllMute(scope.$index, scope.row)"
          >全员禁言</el-button
        >
        <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        title="确定删除该渠道吗？"
        @confirm="handleDissolve(scope.$index, scope.row)"
      >
        <template #reference>
          <el-button size="small" type="danger">解散</el-button>
        </template>
      </el-popconfirm>
    </slot> -->
    </template>
  </table-modal>

  <!-- <add-modal
  :addVisible="isAddShow"
  :tagData="tagData"
  @updateList="$upTableList(tableRef)"
  @closeModal="isAddShow = false"
/> -->
  <edit-modal
  v-if="isEditShow"
  :addVisible="isEditShow"
  :tagData="tagData"
  @updateList="$upTableList(tableRef)"
  @closeModal="isEditShow = false"
  :info="msgInfo"
/>
  <msgDetail
  v-if="isShowMsg"
  :addVisible="isShowMsg"
  :tagData="tagData"
  @updateList="$upTableList(tableRef)"
  @closeModal="isShowMsg = false"
  :info="msgInfo"></msgDetail>

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
import editModal from "./module/edit.vue";
import msgDetail from "@/components/msgDetail/index.vue";
import detailModal from "@/components/userDetail/index.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const isShowMsg = ref(false);
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
  isShowTable: false
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);

const msgTypeList = ref({
  'TIMTextElem':'文本消息',
  'TIMLocationElem':'地理位置消息',
  'TIMFaceElem':'表情消息',
  'TIMCustomElem':'自定义消息',
  'TIMSoundElem':'语音消息',
  'TIMImageElem':'图像消息',
  'TIMFileElem':'文件消息',
  'TIMVideoFileElem':'视频消息',
  'TIMRelayElem':'合并转发消息',
})

const column = [
  { title: "id", key: "id" },
  { title: "消息序列号", key: "MsgSeq" },
  { title: "群ID", key: "GroupId" },
  { title: "群名称", key: "Name" },
  { title: "发送者", key: "From_Account", isNeedSlot: true },
  { title: "操作者", key: "Operator_Account" },
  { title: "消息类型", key: "MsgType", isNeedSlot: true },
  { title: "消息内容", key: "MsgBody", isNeedSlot: true, width: 200 },
  { title: "发送时间", key: "MsgTime", keyType: "time", width: 90 },
  // { title: "事件触发", key: "EventTime", keyType: "time", width: 90 },
  // { title: "消息随机数", key: "MsgRandom" },
  // { title: "话题ID", key: "TopicId" },
  // { title: "仅发送在线用户", key: "OnlineOnlyFlag" },
  { title: "操作", key: "edit_row",isNeedSlot: true, width: 150 },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "消息模糊查找", key: "text", width: 200 },
    // { type: "input", placeholder: "群名称", key: "name", width: 200 },
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
  text: "",
  name: "",
  groupId: "",
  start_time: "",
  end_time: "",
  channel: "",
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
const msgInfo = ref();

onMounted(() => {
  getChannelList();

  getGroupId()
  
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
  queryParam['start_time,end_time'] = [0,0]
  queryParam.groupId = '';
}

const showUserDetail = (account) => {
    let info = {
        account: account
    }
    editInfo.value = info;
    isDetailShow.value = true;
}


//获取群id搜索
const getGroupId = () => {
    let id = store.state.app.groupId
    queryParam.groupId = id;
    store.commit('app/setGroupId','')
    state.isShowTable = true
}

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};

//设置图片
const setImg = (e) =>{
  let data = JSON.parse(e)
  let url = data.ImageInfoArray[0].URL
  return url
}

const checkMsg = (idx, row) => {
  console.log(row);
  isShowMsg.value = true;
  msgInfo.value = row;
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
  msgInfo.value = row;
};
// 删除
const handleDelete = (index, row) => {
  // console.log(row);
  let list = [];
  list.push(row.MsgSeq)
  $api.groupmsg
    .del({
      groupId: row.GroupId,
      list: list
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

.msg-body{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.msgClass{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  height: 100px;
}

.msg-text{
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 设置最大显示行数 */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  width: 150px;
  text-align: center;
}

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

<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="appPhrase.appPhraseList"
    @searchReset="searchReset"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'status'">
        <div>
          {{ scope.row.status == 1 ? "正常" : "禁用" }}
        </div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <multipleBtn width="200">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该常用语吗？"
            @confirm="deleteMsgTwo(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>

          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            :type="scope.row.status == 1 ? 'danger' : 'primary'"
            @click="handleShang(scope.$index, scope.row)"
            >{{scope.row.status == 1 ? '禁用' : '正常'}} </el-button
          >
        </multipleBtn>
      </slot>
    </template>

    <template #leftView>
      <el-button type="primary" @click="isSendShow = true">新增</el-button>
       <el-button type="primary" @click="isBatchShow = true">批量</el-button>
    </template>
  </table-modal>

  <send-modal
    v-if="isSendShow"
    :addVisible="isSendShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isSendShow = false"
  />

  <sendBatch
    v-if="isBatchShow"
    :addVisible="isBatchShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isBatchShow = false"
  />
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
    :info="msgInfo"
  ></msgDetail>

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
import sendModal from "./module/sendMsg.vue";
import sendBatch from "./module/sendMsgBatch.vue";
import editModal from "./module/edit.vue";
import msgDetail from "@/components/msgDetail/index.vue";
import multipleBtn from "@/components/multipleBtn/index.vue";
import detailModal from "@/components/userDetail/index.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isSendShow = ref(false);
const isBatchShow = ref(false);
const isEditShow = ref(false);
const isShowMsg = ref(false);
const isDetailShow = ref(false);
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
  { title: "id", key: "id" },
  { title: "常用语", key: "phrase" },
  { title: "排序", key: "sort" },
  { title: "时间", key: "create_at", keyType: "time" },
  { title: "状态", key: "status", isNeedSlot: true },
  { title: "操作", key: "edit_row" },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "常用语", key: "phrase", width: 150 },
    {
      type: "datetimerange",
      key: ["start_time", "end_time"],
      placeholder: ["开始时间", "结束时间"],
    },
    {
      type: "select",
      key: "status", // 表单域model字段 必填
      placeholder: "状态",
      options: [
           {
          value: 1,
          label: "正常",
        },
        {
          value: 2,
          label: "禁用",
        },
      ],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  phrase: "",
  status: "",

});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
const msgInfo = ref();
onMounted(() => {
  // getChannelList();
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

const showUserDetail = (account) => {
  let info = {
    account: account,
  };
  editInfo.value = info;
  isDetailShow.value = true;
};

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};

//设置图片
const setImg = (e) => {
  let data = JSON.parse(e);
  let url = data.ImageInfoArray[0].URL;
  return url;
};

// 删除消息
const deleteMsgTwo = (index, row) => {
  $api.appPhrase
    .appPhraseDel({
      id: row.id,
    })
    .then((res) => {
      up();
    });
};

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
      console.log("getChannelList", res.data.list);
      let data = [];
      res.data.list.forEach((item) => {
        data.push({
          value: item.code,
          label: item.name,
        });
      });
      formConfig.formItemList[2].options = data;
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
const handleShang = (index, row) => {
  $api.appPhrase
    .appPhraseOnline({
      id: row.id,
      status: row.status == 1 ? 2 : 1
    })
    .then((res) => {
      ElMessage({
        type: "success",
        showClose: true,
        message: "操作成功",
      });
      up();
    });
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
.msg-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.msgClass {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  height: 100px;
}

.msg-text {
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

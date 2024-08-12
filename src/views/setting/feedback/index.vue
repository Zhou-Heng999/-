<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="appFeedback.feedbackList"
    @searchReset="searchReset"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'status'">
        <div v-if="scope.row.status == 0 || scope.row.status == 1 ">未读</div>
        <div v-if="scope.row.status == 2">已读</div>
        <div v-if="scope.row.status == 3">已回复</div>
        <div v-if="scope.row.status == 4">已解决</div>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'imgs'">
       <div class="flex-center">
         <div class="demo-image__preview"  style="width: 100px; display: flex; flex-wrap: wrap;" v-for="(item,index) in urlList(scope.row.imgs)" :key="index" >
            <el-image
              :preview-teleported="true"
              style="width: 100px; height: 100px"
              :src="item"
              :z-index="99"
              :preview-src-list="[item]"
              :initial-index="index"
              fit="cover"
            />
        </div>
       </div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <multipleBtn width="200">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="修改成未读？"
            @confirm="caozuo(1, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">未读</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="修改成已读？"
            @confirm="caozuo(2, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">已读</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="修改成已回复？"
            @confirm="caozuo(3, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">已回复</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="修改成已解决？"
            @confirm="caozuo(4, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">已解决</el-button>
            </template>
          </el-popconfirm>
        </multipleBtn>
        <el-button
          size="small"
          type="primary"
          @click="handleReply( scope.row)"
          >回复</el-button
        >
      </slot>
    </template>

    <template #leftView> </template>
  </table-modal>
  
  <replyModal
    v-if="isReplyShow"
    :addVisible="isReplyShow"
    @updateList="$upTableList(tableRef)"
    @closeModal="isReplyShow = false"
    :info="editInfo"
  ></replyModal>
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
import replyModal from "./module/reply.vue";
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
const isReplyShow = ref(false);
const router = useRouter();
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 100,
  search: "",
  total: 0,
  channelList: [],

});
const tableRef = ref(null);
const dialogFormVisible = ref(true);

const column = [
  { title: "id", key: "id" },
  { title: "内容", key: "content" },
  { title: "联系方式", key: "contact" },
  { title: "反馈图片", key: "imgs", isNeedSlot: true ,width:"500"},
  { title: "时间", key: "create_at", keyType: "time" },
  { title: "状态", key: "status", isNeedSlot: true },
  { title: "操作", key: "edit_row" },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "id", key: "id", width: 150 },
    { type: "input", placeholder: "内容", key: "word", width: 150 },
    {
      type: "select",
      key: "status", // 表单域model字段 必填
      placeholder: "状态",
      options: [
        {
          value: 1,
          label: "未读",
        },
        {
          value: 2,
          label: "已读",
        },
        {
          value: 3,
          label: "已回复",
        },
        {
          value: 4,
          label: "已解决",
        },
      ],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  userId: "",
  word: "",
  status: "",
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
const msgInfo = ref();
onMounted(() => {
  // getChannelList();
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

const urlList = (imgs) => {
  let imgArr = imgs.split(";");
  return imgArr
};



const searchReset = () => {
  queryParam["start_time,end_time"] = [0, 0];
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


const caozuo = (index, row) => {
  console.log(index,row);
   $api.appFeedback
    .feedbackModifyStatus({
      status:index,
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

const handleReply = (row) => {
  isReplyShow.value = true
  editInfo.value = row
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
      status: row.status == 1 ? 2 : 1,
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

.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>

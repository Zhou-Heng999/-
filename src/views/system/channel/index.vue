<template>
    <table-modal
    :tableHeader="column"
    :valueForm="queryParam"
    tableUrl="channel.list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'allow_type'">
        <div>{{ scope.row.allow_type == 1 ? "陌生人社交" : scope.row.allow_type == 2 ? "熟人社交" : scope.row.allow_type == 3 ? "拒绝社交":""}}</div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'status'">
        <el-tag v-if="scope.row.status==1" round type="success">已上线</el-tag>
        <el-tag v-if="scope.row.status==0" round type="danger">已下线</el-tag>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        :title="`确定${scope.row.status == 0 ? '上线':'下线'}该渠道吗？`"
        @confirm="handleOnline(scope.$index, scope.row)"
      >
        <template #reference>
          <el-button size="small"
          :type="scope.row.status == 0 ? 'success' : 'danger'"
          >{{ scope.row.status == 0 ? "上线" : "下线" }}</el-button>
        </template>
      </el-popconfirm>

        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon="el-icon-info"
        icon-color="red"
        title="确定删除该渠道吗？"
        @confirm="handleDelete(scope.$index, scope.row)"
      >
        <template #reference>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-popconfirm>
      </slot>
    </template>

    <template #leftView>
      <el-button type="primary" @click="isAddShow = true">新增</el-button>
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
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const { num } = mixin();
// const { timestampToTime } = util();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
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
  total:0
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});
const column = [
  { title: "id", key: "id" },
  { title: "渠道", key: "name" },
  { title: "渠道代码", key: "code" },
  { title: "应用名", key: "appname" },
  // { title: "appid", key: "appid" },
  { title: "sdkappid", key: "sdkappid" },
  { title: "密钥", key: "secret" },
  { title: "回调密钥", key: "cb_token" },
  { title: "社交模式", key: "allow_type", isNeedSlot: true},
  { title: "创建时间", key: "created_at", keyType: 'time', width: 90 },
  { title: "更新时间", key: "updated_at", keyType: 'time', width: 90 },
  { title: "状态", key: "status",isNeedSlot: true },
  { title: "操作", key: "edit_row",isNeedSlot: true,width:200 },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "名称模糊查询", key: "name", width:200 },
  ],
});
const queryParam = reactive({
  //搜索表单
  size:100000,
  page: 1
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  // getChannelList();
  getTag();
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

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};

const handleOnline = (index, row) => {
  $api.channel
    .online({
      id: row.id,
      status: row.status==0? 1:0,
    })
    .then((res) => {
      up();
    });
};

const getChannelList = () => {
  $api.channel
    .list({
      size: state.pageSize,
      page: state.currentPage,
    })
    .then((res) => {
      let data = res.data
      state.tableData = data.list;
      state.total = data.total
      // console.log("getChannelList", res);
      tableLoading.value = false;
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
  console.log(row)
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

const handleSizeChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  state.currentPage = 1;
  // request api to change tableData
};
const handleCurrentChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  getChannelList();
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

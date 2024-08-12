<template>
    <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="appDevice.list"
    ref="tableRef"
    @searchReset="searchReset"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'bind'">
        <div>{{ scope.row.bind == 0 ? "否" : "是"}}</div>
      </slot>

      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        
        <el-button size="small"
          :type="scope.row.status == 0 ? 'success' : 'danger'" @click="handleOnline(scope.$index, scope.row)"
          >{{ scope.row.status == 0 ? "上架" : "下架" }}</el-button
        >

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

    <!-- <template #leftView>
      <el-button type="primary" @click="isAddShow = true">新增</el-button>
    </template> -->
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
  // { title: "渠道代码", key: "code" },
  // { title: "应用名", key: "appname" },
  { title: "用户id", key: "userID" },
  { title: "用户昵称", key: "nick" },
  { title: "设备平台", key: "os" },
  { title: "设备型号", key: "model" },
  { title: "是否绑定", key: "bind",isNeedSlot: true},
  { title: "登录版本", key: "version"},
  { title: "ip地址", key: "login_ip"},
  { title: "登录时间", key: "login_time", keyType: 'time', width: 90 },
  // { title: "状态", key: "status",isNeedSlot: true },
  // { title: "操作", key: "edit_row",isNeedSlot: true,width:200 },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "昵称模糊查询", key: "nick", width:200 },
    { type: "input", placeholder: "账号", key: "account", width:200 },
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
    // {
    //   type: "select",
    //   key: "os", // 表单域model字段 必填
    //   placeholder: "设备系统",
    //   options: [],
    // },
  ],
});
const queryParam = reactive({
  //搜索表单
  nick: "",
  account: "",
  start_time: "",
  end_time: "",
  os: "",
  channel: "",
  bind: ""
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
  queryParam['start_time,end_time'] = [0,0]
}

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
      let data = [];
        res.data.list.forEach(item => {
          data.push({
            value: item.code,
            label: item.name
          })
        });
      formConfig.formItemList[3].options = data;
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

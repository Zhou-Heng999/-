<template>
  <table-modal
    :tableHeader="column"
    :valueForm="queryParam"
    tableUrl="channel.show"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
       <div class="aaa flex-content" @click="goURL">
         <a
          :href="scope.row.url + '?token=' + url.token + '&userInfo=' + url.userInfo"
          target="_blank"
        >
          <div class="">前往</div>
        </a>
       </div>
      </slot>
    </template>

    <template #leftView>
      <!-- <el-button type="primary" @click="isAddShow = true">新增</el-button> -->
    </template>
  </table-modal>
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
  total: 0,
});

const url = reactive({
  userInfo: "",
  token: "",
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
  { title: "url", key: "url" },
  { title: "操作", key: "edit_row", isNeedSlot: true, width: 200 },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "名称模糊查询", key: "name", width: 200 },
  ],
});
const queryParam = reactive({
  //搜索表单
  size: 100000,
  page: 1,
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  // getChannelList();
  getTag();
});

const goURL = () => {
  // token.value  = ''
  // userInfo.value  = null
  const u = btoa(localStorage.getItem("userInfo"));
  const t = btoa(localStorage.getItem("token"));
  console.log("token", t); // 输出参数值：
  console.log("userInfo", u); // 输出参数值：
  url.userInfo = u;
  url.token = t;
  console.log(" userInfo.value ", url.userInfo); // 输出参数值：
  console.log(" token.value ", url.token); // 输出参数值：
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

const getChannelList = () => {
  $api.channel
    .list({
      size: state.pageSize,
      page: state.currentPage,
    })
    .then((res) => {
      let data = res.data;
      state.tableData = data.list;
      state.total = data.total;
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
.aaa {
  background: #67c23a;
  width: 50%;
  margin-left: 45px;
  border-radius: 5px;
  color: #fff;
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

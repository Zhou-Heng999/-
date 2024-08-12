<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
     :valueForm="queryParam"
    tableUrl="oplog.oplogList"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'content'">
        <div v-if="parseMenuString(scope.row.content).length > 0">
          {{ scope.row.content }}
          <!-- <div
            v-for="(menu, index) in (scope.row.content)"
            :key="index"
          >
            {{ menu }}
          </div> -->
        </div>
        <div v-else>
          <p>{{ scope.row.content }}</p>
        </div>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定删除该应用吗？"
          @confirm="handleDelete(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </slot>
    </template>

    <template #leftView>
      <!-- <el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >新增</el-button
      > -->
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
import codeModal from "@/components/googleCode/index.vue";
import store from "@/store";
import { useRouter } from "vue-router";
import searchBar from "@/components/SearchBar/index.vue";
const { proxy } = getCurrentInstance();
const { num } = mixin();
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
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const column = [
  { title: "时间", key: "created_at", keyType: "time" },
  { title: "账号", key: "account" },
  { title: "内容", key: "content", isNeedSlot: true },
  { title: "ip", key: "ip" },

  // { title: "操作", key: "edit_row", isNeedSlot: true, },
];

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "请输入账号id", key: "account", width: 200 },
    {
      type: "datetimerange",
      key: ["start_time", "end_time"],
      placeholder: ["开始时间", "结束时间"],
    },
    // {
    //   type: "select",
    //   key: "role_id", // 表单域model字段 必填
    //   placeholder: "角色",
    //   options: [],
    // },
  ],
});
const queryParam = reactive({
  //搜索表单
  // name: "",
  account: "",
  start_time: "",
  end_time: "",
});

const parseMenuString = (menuString) => {
  const regex = /\{([^}]*)\}/g;
  const matches = menuString.match(regex);
  const menuArray = [];

  if (matches) {
    matches.forEach((match) => {
      const menuObject = {};
      match.split(" ").forEach((item) => {
        const keyValue = item.split(":");
        menuObject[keyValue[0]] = keyValue[1];
      });
      menuArray.push(menuObject);
    });
  }

  return menuArray;
};

// const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  // getAppList();
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

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};

const getAppList = () => {
  $api.app
    .list({
      size: state.pageSize,
      page: state.currentPage,
    })
    .then((res) => {
      let data = res.data;
      state.tableData = data.list;
      state.total = data.total;
      // console.log("getAppList", res);
      tableLoading.value = false;
    });
};

const getTag = () => {
  // $api.dictionary
  //   .list({
  //     size: "100",
  //     page: "1",
  //   })
  //   .then((res) => {
  //     let a = res.data.find((item) => item.type == "CURRENCY_CODE");
  //     state.tagData = a.itemList;
  //     console.log("tagData", state.tagData);
  //   });
};
const resetDateFilter = () => {
  filterTableRef.value.clearFilter("date");
};

const clearFilter = () => {
  filterTableRef.value.clearFilter();
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
  $api.app
    .del({
      id: row.sdkappid,
    })
    .then((res) => {
      ElMessage({
        type: "success",
        showClose: true,
        message: "删除成功",
      });

      // state.tableData.splice(index, 1);
    })
    .finally(() => {
      up();
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
  getAppList();
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

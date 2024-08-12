<template>
  <table-modal :tableHeader="column" :tableList="state.tableData">
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button
          size="small"
          type="primary"
          @click="handleEdit(scope.$index, scope.row)"
          > 编辑</el-button
        >
        <!-- {{ $t("lang.283") }}  -->

        <el-popconfirm title="是否删除此菜单?" @confirm="deleIt(scope.row)">
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </slot>
    </template>
    <template #leftView>
      <!--  v-has="['3-5']" -->
      <!--  $t("lang.279") -->
      <el-button type="primary" @click="isAddShow = true">{{
        '添加菜单'
      }}</el-button>
    </template>
  </table-modal>

  <add-modal
    v-if="isAddShow"
    :menuData="state.menuData"
    :addVisible="isAddShow"
    @updateList="getMenuList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :menuData="state.menuData"
    :addVisible="isEditShow"
    @updateList="getMenuList"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
</template>
<script setup>
import i18n from "@/locales/index";

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
import codeModal from "@/components/googleCode/index.vue";
import store from "@/store";
import { useRouter } from "vue-router";

const t = i18n.global.t;

const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const router = useRouter();
const isCodeShow = ref(false);
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 200,
  search: "",
  menuData: [],
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

// 删除菜单
const deleIt = (row) => {
  $api.roles
    .delete_menu({
      id: row.id,
    })
    .then((res) => {
      getMenuList();
      // console.log(res);
    });
  console.log(row);
};
const column = [
  { title: "名字", key: "name" },
  { title: "路径", key: "view_name" },
  { title: "菜单组", key: "menu_group" },
  { title: "排序", key: "weight" },
  { title: "操作", key: "edit_row" },
];
const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getMenuList();
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
const getMenuList = () => {
  state.menuData = [];
  $api.roles.menuQry().then((res) => {
    state.tableData = res.data.menu;
    tableLoading.value = false;
  });
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

const handleSizeChange = (val) => {
  // eslint-disable-next-line no-console
  state.pageSize = val;
  // request api to change tableData
};
const handleCurrentChange = (val) => {
  // eslint-disable-next-line no-console
  state.currentPage = val;
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
.button-group {
  margin-left: 15px;
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

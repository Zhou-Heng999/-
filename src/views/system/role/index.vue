<template>
  <div class="button-group">
    <el-button type="primary" :icon="Plus" @click="isAddShow = true">添加角色</el-button>
  </div>

  <div class="table-container">
    <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
      :row-class-name="tableRowClassName"
    >
     <el-table-column prop="id" label="编号" width="100"> </el-table-column>
      <el-table-column prop="name" label="角色名" width="200"> </el-table-column>
      <el-table-column prop="pid" label="父角色id" width="200"> </el-table-column>
      <el-table-column prop="pname" label="父角色名" width="200"> </el-table-column>
      <el-table-column prop="menu_name_l" label="菜单权限">
        <template #default="scope">
          <div v-for="(mlist,group) in scope.row.menu_name_l">
            <el-tag type="warning">{{group}}</el-tag>
            <el-tag v-for="m in mlist" type="success">{{m}}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" width="100">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <add-modal
    v-if="isAddShow"
    :menuData="state.menuData"
    :addVisible="isAddShow"
    @updateList="getRolesList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :menuData="state.menuData"
    :addVisible="isEditShow"
    @updateList="getRolesList"
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
import codeModal from "@/components/googleCode/index.vue";
import store from "@/store";
import { useRouter } from "vue-router";
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
  pageSize: 100,
  search: "",
  menuData:[],
  menuDict:{}
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getMenuList();
  // getRolesList();
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

const clearGoogle = (id) => {
  codeType.value = "clear";
  rowUserId.value = id;
  isCodeShow.value = true;
};
const getRolesList = () => {
  $api.roles
    .roleQry({
      size: "100",
      page: "1",
    })
    .then((res) => {
      state.tableData = []
      console.log("state.menuDict...", state.menuDict)
      for (var i in res.data.list) {
        var item = res.data.list[i]
        var mg_name = {}
        for (var j in res.data.list[i].menu_ids) {
          var group = state.menuDict[res.data.list[i].menu_ids[j]]["group"]
          var mname = state.menuDict[res.data.list[i].menu_ids[j]]["label"]
          if (mg_name.hasOwnProperty(group)) {
            mg_name[group].push(mname)
          } else {
            mg_name[group] = [mname]
          }
        }
        item["menu_name_l"] = mg_name
        console.log("mg_name...", mg_name)
        state.tableData.push(item)
      }
      console.log("getRolesList", state.tableData);
      tableLoading.value = false;
    });
};
const getMenuList = () => {
    state.menuData = []
  $api.roles
    .menuGroup2()
    .then((res) => {
      state.menuDict = {}
      for(var i in res.data.menus_list){
          let _tree = {}
          _tree["label"] = res.data.menus_list[i]["name"]
          _tree["children"] = []
          for (var j in res.data.menus_list[i]["children"]) {
              let _childs = {}
              _childs["id"] = res.data.menus_list[i]["children"][j]["id"]
              _childs["label"] = res.data.menus_list[i]["children"][j]["name"]
              _childs["group"] = res.data.menus_list[i]["name"]
              _tree["children"].push(_childs)
              state.menuDict[_childs["id"]] = _childs
          }
          state.menuData.push(_tree)
      }
      console.log("getMenuList", state.menuData);
      tableLoading.value = false;
      getRolesList();
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
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  // request api to change tableData
};
const handleCurrentChange = (val) => {
  // eslint-disable-next-line no-console
  console.log(`当前页: ${val}`);
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
  // .table-list {
  //   margin: 15px;
  // }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

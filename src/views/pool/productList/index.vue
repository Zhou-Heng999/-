<template>
  <div class="table-container">
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">添加矿池</el-button>
    </div>

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
      <el-table-column prop="p_index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="矿池名称"> </el-table-column>
      <el-table-column prop="stake_time" label="挖矿期限(天)"></el-table-column>
      <el-table-column prop="max_quantity" label="可持有最大数量"> </el-table-column>
      <el-table-column prop="total_quantity" label="总可质押数量"> </el-table-column>
      <el-table-column prop="rate" label="日化率(%)">
        <template #default="scope">
          <el-tag type="info">{{scope.row.rate}}%</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_online" label="是否上线">
        <template #default="scope">
          <el-tag v-if="scope.row.is_online==1" type="success">上线</el-tag>
          <el-tag v-else type="danger">下线</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button v-if="scope.row.is_online==1" size="small" type="danger" @click="handleOffLine(scope.row)"
            >下线</el-button>
            <el-button v-else size="small" type="warning" @click="handleOnLine(scope.row)"
              >上线</el-button>
          <el-button size="small" type="info" @click="handleEdit(scope.row)"
            >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="getProductList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="getProductList"
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
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
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
  pageSize: 100,
  search: "",
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getProductList();
});

const handleOnLine = (row) => {
  $api.pool
    .onlineProduct({
      id:row.id,
      state:row.is_online==1?0:1,
    })
    .then((res) => {
      getProductList()
    });
}

const handleOffLine = (row) => {
  $api.pool
    .onlineProduct({
      id:row.id,
      state:row.is_online==1?0:1,
    })
    .then((res) => {
      getProductList()
    });
}

const tableRowClassName = (e) => {
  let { row, rowIndex } = e;
  // console.log(row, rowIndex, store.state.app.userInfo.username);
  if (row.name == store.state.app.userInfo.username) {
    return "warning-row";
  }
  return "";
};

// methods
const getProductList = () => {
  $api.pool
    .getProductList({})
    .then((res) => {
      state.tableData = res.data;
      console.log("getProductList", res);
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
const handleEdit = ( row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
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

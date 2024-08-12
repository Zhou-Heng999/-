<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="getCurrencyList"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">新建币种</el-button>
    </div>
    <el-table
      ref="filterTableRef1"
      stripe
      class="table-list"
      row-key="id"
      :data="state.tb1"
      style="width: 100%"
      v-loading="tableLoading"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="c_index" width="60" label="序号"> </el-table-column>
      <el-table-column prop="icon" label="图标">
        <template #default="scope">
          <img :src="scope.row.icon" alt style="max-height: 50px;" width="50" @click="">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="币种">
        <template #default="scope">
          {{scope.row.name}}{{scope.row.text}}
        </template>
      </el-table-column>
      <el-table-column prop="base" label="火币K线"> </el-table-column>
      <!--<el-table-column prop="deposit" label="价格(USDT)"> </el-table-column>-->
      <el-table-column prop="fee_percent" label="手续费">
        <template #default="scope">
          {{scope.row.fee_percent}}%
        </template>
      </el-table-column>
      <el-table-column prop="is_recommend" label="推荐">
        <template #default="scope">
          <el-tag v-if="scope.row.is_recommend==1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_online" label="是否上线">
        <template #default="scope">
          <el-tag v-if="scope.row.is_online==1" type="success">上线</el-tag>
          <el-tag v-else type="danger">下线</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="right" width="250">
        <template #default="scope">
          <el-button v-if="scope.row.is_online==1" size="small" type="danger" @click="handleOnLine(scope.row)"
            >下线</el-button>
          <el-button v-else size="small" type="warning" @click="handleOnLine(scope.row)"
            >上线</el-button>

            <el-button size="small" type="info" @click="handleEdit(scope.row)"
              >编辑</el-button>

          <el-button v-if="scope.row.is_recommend==1" size="small" type="danger" @click="handleRecommend(scope.row)"
            >取消推荐</el-button>
          <el-button v-else size="small" type="warning" @click="handleRecommend(scope.row)"
            >推荐</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:currentPage="state.currentPage1"
        v-model:page-size="state.pageSize1"
        :page-sizes="[20, 100, 200, 300, 400]"
        :small="small"
        :disabled="disabled"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total1"
        background
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
      />
  </div>
  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="getCurrencyList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="getCurrencyList"
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
const isCodeShow = ref(false);
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
  tb1: [],
  currentPage1: 1,
  pageSize1: 100,
});
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "币种名称", key: "name" },
  ],
});
const queryParam = reactive({
  //搜索表单
  name: "",
});

const handleOnLine = (row) => {
  $api.speed
    .onlineCurrency({
      id:row.id,
      state:row.is_online==1?0:1,
    })
    .then((res) => {
      getCurrencyList()
    });
}

const handleRecommend = (row) => {
  $api.speed
    .recommend({
      id:row.id,
      state:row.is_recommend==1?0:1,
    })
    .then((res) => {
      getCurrencyList()
    });
}

const total = computed(() => state.tableData.length);
const editInfo = ref();
onMounted(() => {
  getCurrencyList();
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
const getCurrencyList = () => {
  $api.speed
    .getCurrencyList({
      name : queryParam.name,
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.tb1 = res.data;
      state.total1 = res.count
      console.log("getUsersList", res);
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
const handleEdit = (row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
};
const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getCurrencyList();
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getCurrencyList();
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

<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="searchQuery"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >新建充值商户</el-button
      >
    </div>
    <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="id" label="ID" width="60"> </el-table-column>
      <el-table-column prop="name" label="商户名"> </el-table-column>
      <el-table-column prop="vipLevel" label="VIP等级"> </el-table-column>
      <el-table-column prop="code" label="货币符号"> </el-table-column>

      <el-table-column prop="uintPrice" label="单价"> </el-table-column>
      <el-table-column prop="bankName" label="银行名字"> </el-table-column>

      <el-table-column prop="selectName" label="银行卡号"> </el-table-column>

      <el-table-column prop="quantity" label="数量"> </el-table-column>
      <el-table-column prop="closeRate" label="成交率(%)"> </el-table-column>
      <el-table-column label="限额">
        <template #default="scope">
          <span>{{ scope.row.minLimit }}</span>
          -
          <span>{{ scope.row.maxLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isOpen" label="状态">
        <template #default="scope">
          <el-button
            size="small"
            :type="scope.row.isOpen == true ? 'success' : 'warning'"
          >
            {{ scope.row.isOpen == true ? "开启" : "关闭" }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该条记录吗？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="flex-end">
      <el-pagination
        v-model:currentPage="state.currentPage"
        v-model:page-size="state.pageSize"
        :page-sizes="[10, 50, 100, 200, 300, 500]"
        :small="small"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
  <add-modal
    :addVisible="isAddShow"
    @updateList="getsellUserList"
    @closeModal="isAddShow = false"
    :bankInfoList="bankList"
  />
  <edit-modal
    v-if="isEditShow"
    :bankInfoList="bankList"
    :addVisible="isEditShow"
    @updateList="getsellUserList"
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
import { Plus } from "@element-plus/icons-vue";
import addModal from "./module/add.vue";
import editModal from "./module/edit.vue";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { ElMessage } from "element-plus";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const filterTableRef = ref();
const tableLoading = ref(true);
const state = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 50,
});

const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [{ type: "input", placeholder: "输入商户名称", key: "name" }],
});
const queryParam = reactive({
  //搜索表单
  name: "",
});

const editInfo = ref();

// 初始化加载
onMounted(() => {
  let param = {
    size: state.pageSize,
    page: state.currentPage,
  };
  getsellUserList(param);
  getBankList();
});
// 获取银行卡信息
const bankList = ref([]);
const getBankList = () => {
  $api.trans.get_bank_info().then((res) => {
    bankList.value = res.data;
    console.log("获取银行卡信息", res);
  });
};

// methods
// 获取表格数据
const getsellUserList = (param) => {
  $api.trans.sell_user_list(param).then((res) => {
    state.tableData = res.data;
    console.log("getsellUserList", res);
    tableLoading.value = false;
    state.total = res.count;
  });
};

const searchQuery = (val) => {
  console.log("searchQuery", val);
  let param = {
    size: state.pageSize,
    page: state.currentPage,
    name: val.name,
  };
  getsellUserList(param);
};
const searchReset = () => {
  console.log("searchReset");
};

// 编辑
const handleEdit = (index, row) => {
  editInfo.value = row;
  isEditShow.value = true;
};
// 删除
const handleDelete = (index, row) => {
  let param = {
    id: row.id,
  };
  $api.trans.del_seller(param).then((res) => {
    console.log("del_seller", res);
    ElMessage({
      type: "success",
      showClose: true,
      message: "删除成功",
    });
    getsellUserList({
      size: state.pageSize,
      page: state.currentPage,
    });
  });
};

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  getsellUserList({
    size: state.pageSize,
    page: state.currentPage,
  });
};
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  getsellUserList({
    size: state.pageSize,
    page: state.currentPage,
  });
};
</script>
<style lang="scss" scoped>
.button-group {
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
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

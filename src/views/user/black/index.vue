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
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">添加</el-button>
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
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="real_name" label="姓名"> </el-table-column>
      <el-table-column prop="card_no" label="身份证"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
      @updateList="getBlackList"
      @closeModal="isAddShow = false"
  />
  <edit-modal
      v-if="isEditShow"
      :addVisible="isEditShow"
      @updateList="getBlackList"
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
  import {Plus} from '@element-plus/icons-vue'
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
    pageSize: 100,
    tableData: [],
  });
  const formConfig = reactive({
    // 搜索栏配置项
    formItemList: [
      { type: "input", placeholder: "手机号", key: "phone" },
      { type: "input", placeholder: "姓名", key: "real_name" },
      { type: "input", placeholder: "身份证", key: "card_no" },
    ],
  });
  const queryParam = reactive({
    //搜索表单
    phone: "",
    real_name: "",
    card_no: "",
  });

  const editInfo = ref();

  // 初始化加载
  onMounted(() => {
    getBlackList();
  });

  // methods
  // 获取表格数据
  const getBlackList = () => {
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      phone: queryParam.phone,
      real_name: queryParam.real_name,
      card_no: queryParam.card_no,
    }
    $api.users
        .getBlack(param)
        .then((res) => {
          state.tableData = res.data;
          console.log("getBlackList", res);
          tableLoading.value = false;
          state.total = res.count;
        });
  };

  const searchQuery = (val) => {
    console.log("searchQuery", val)
    queryParam.phone = val.phone;
    queryParam.real_name = val.real_name;
    queryParam.card_no = val.card_no;
    getBlackList();
  };
  const searchReset = () => {
    console.log("searchReset");
  };

  // 编辑
  const handleEdit = (index, row) => {
    editInfo.value= row;
    isEditShow.value = true;
  };
  // 删除
  const handleDelete = (index, row) => {
    let param = {
      phone:row.phone
    }
    $api.users
        .delBlack(param)
        .then((res) => {
          console.log("delBlack", res);
          ElMessage({
            type: "success",
            showClose: true,
            message: "删除成功",
          });
          getBlackList({
            size: state.pageSize,
            page: state.currentPage,
          });
        });
  };

  const handleSizeChange = (val) => {
    console.log(`每页 ${val} 条`);
    state.pageSize = val;
    getBlackList();
  };
  const handleCurrentChange = (val) => {
    console.log(`当前页: ${val}`);
    state.currentPage = val;
    getBlackList();
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

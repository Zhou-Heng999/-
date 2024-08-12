<template>
  <div class="table-container">
    <search-bar
            :form-config="formConfig"
            :valueForm="queryParam"
            @handleSearch="searchQuery"
            @handleReset="searchReset"
            class="bar"
    ></search-bar>
    <el-table
            ref="filterTableRef"
            size="small"
            stripe
            class="table-list"
            row-key="date"
            :data="state.tableData"
            style="width: 100%"
            v-loading="tableLoading"
    >
      <el-table-column prop="id" label="序号" width="50"> </el-table-column>
      <el-table-column prop="fromAccount" label="划出账号"> </el-table-column>
      <el-table-column prop="toAccount" label="目标账号"> </el-table-column>
      <el-table-column prop="money" label="金额(USDT)"> </el-table-column>
      <el-table-column prop="fee" label="手续费(USDT)"> </el-table-column>
      <el-table-column prop="createDate" label="划出时间"> </el-table-column>
      <el-table-column prop="endDate" label="到账时间"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-button size="small" type="warning" v-if="scope.row.status == 1"> 未处理 </el-button>
          <el-button size="small" type="success" v-if="scope.row.status == 2"> 通过 </el-button>
          <el-button size="small" type="danger" v-if="scope.row.status == 3"> 拒绝 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定同意吗？"
                  @confirm="handleEdit(scope.row, 1)"
                  v-if="scope.row.status == 1"
          >
            <template #reference>
              <el-button size="small" type="primary">同意</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定拒绝吗？"
                  @confirm="handleEdit(scope.row, 0)"
                  v-if="scope.row.status == 1"
          >
            <template #reference>
              <el-button size="small" type="danger">拒绝</el-button>
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
  import store from "@/store";
  import searchBar from "@/components/SearchBar/index.vue";
  import { ElMessage } from "element-plus";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  const filterTableRef = ref();
  const tableLoading = ref(true);
  const state = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 50,
  });

  const formConfig = reactive({
    // 搜索栏配置项
    formItemList: [
      { type: "input", placeholder: "划出账号", key: "fromAccount" },
      { type: "input", placeholder: "目标账号", key: "toAccount" },
      {
        type: "datetimerange",
        key: "rangeTime",
        placeholder: ["开始时间", "结束时间"],
      },
      {
        type: "select",
        key: "status", // 表单域model字段 必填
        placeholder: "状态",
        options: [
          {
            value: 0,
            name: "全部",
          },
          {
            value: 1,
            name: "未处理",
          },
          {
            value: 2,
            name: "同意",
          },
          {
            value: 3,
            name: "拒绝",
          },
        ],
      },
    ],
  });
  const queryParam = reactive({
    //搜索表单
    fromAccount: "",
    toAccount: "",
    rangeTime: "",
    status: 0,
  });

  // 初始化加载
  onMounted(() => {
    let startTime = ''
    let endTime = ''
    if (queryParam.rangeTime.length > 0) {
      startTime = queryParam.rangeTime[0] / 1000
      endTime = queryParam.rangeTime[1] / 1000
    }
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      fromAccount: queryParam.fromAccount,
      toAccount: queryParam.toAccount,
      status: queryParam.status,
      startTime: startTime,
      endTime: endTime,
    }
    getTransferList(param);
  });

  // methods
  // 获取表格数据
  const getTransferList = (param) => {
    $api.trans
            .get_transfer_list(param)
            .then((res) => {
              state.tableData = res.data;
              console.log("getTransferList", res);
              tableLoading.value = false;
              state.total = res.count;
            });
  };

  const handleEdit = (row, flag) => {
    let status = 1

    if (flag == 1) {
      status = 2
    } else {
      status = 3
    }
    let param = {
      id: row.id,
      status: status
    }
    $api.trans
            .edit_transfer_status(param)
            .then((res) => {
              console.log("editTransferStatus", res);
              ElMessage({
                type: "success",
                showClose: true,
                message: "修改成功",
              });
              let startTime = ''
              let endTime = ''
              if (queryParam.rangeTime.length > 0) {
                startTime = queryParam.rangeTime[0] / 1000
                endTime = queryParam.rangeTime[1] / 1000
              }
              let param = {
                size: state.pageSize,
                page: state.currentPage,
                fromAccount: queryParam.fromAccount,
                toAccount: queryParam.toAccount,
                status: queryParam.status,
                startTime: startTime,
                endTime: endTime,
              }
              getTransferList(param);
            });
  };

  const searchQuery = (val) => {
    console.log("searchQuery", val)
    let startTime = ''
    let endTime = ''
    if (val.rangeTime.length > 0) {
      startTime = val.rangeTime[0] / 1000
      endTime = val.rangeTime[1] / 1000
    }
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      fromAccount: val.fromAccount,
      toAccount: val.toAccount,
      status: val.status,
      startTime: startTime,
      endTime: endTime,
    }
    getTransferList(param);
  };

  const searchReset = () => {
    console.log("searchReset");
  };

  const handleSizeChange = (val) => {
    console.log(`每页 ${val} 条`);
    state.pageSize = val;
    let startTime = ''
    let endTime = ''
    if (queryParam.rangeTime.length > 0) {
      startTime = queryParam.rangeTime[0] / 1000
      endTime = queryParam.rangeTime[1] / 1000
    }
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      fromAccount: queryParam.fromAccount,
      toAccount: queryParam.toAccount,
      status: queryParam.status,
      startTime: startTime,
      endTime: endTime,
    }
    getTransferList(param);
  };

  const handleCurrentChange = (val) => {
    console.log(`当前页: ${val}`);
    state.currentPage = val;
    let startTime = ''
    let endTime = ''
    if (queryParam.rangeTime.length > 0) {
      startTime = queryParam.rangeTime[0] / 1000
      endTime = queryParam.rangeTime[1] / 1000
    }
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      fromAccount: queryParam.fromAccount,
      toAccount: queryParam.toAccount,
      status: queryParam.status,
      startTime: startTime,
      endTime: endTime,
    }
    getTransferList(param);
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

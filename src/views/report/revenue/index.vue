<template>
  <el-row :gutter="24" justify="space-evenly">
    <el-col :span="8">
      <el-card shadow="always" class="card-mid">
        <div>累计RMB</div>
        <div>{{totalRMB}}</div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="always" class="card-mid">
        <div>累计USDT</div>
        <div>{{totalUSDT}}</div>
      </el-card>
    </el-col>
  </el-row>

  <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
  >
    <el-table-column prop="date" label="日期"> </el-table-column>
    <el-table-column prop="cz_rmb" label="充值RMB"> </el-table-column>
    <el-table-column prop="tx_rmb" label="提现RMB"> </el-table-column>
    <el-table-column prop="yl_rmb" label="盈利RMB"> </el-table-column>
    <el-table-column prop="cz_usdt" label="充值USDT"> </el-table-column>
    <el-table-column prop="tx_usdt" label="提现USDT"> </el-table-column>
    <el-table-column prop="yl_usdt" label="盈利USDT"> </el-table-column>
  </el-table>
  <!--<el-row class="flex-end">-->
    <!--<el-pagination-->
        <!--v-model:currentPage="state.currentPage"-->
        <!--v-model:page-size="state.pageSize"-->
        <!--:page-sizes="[10, 50, 100, 200, 300, 500]"-->
        <!--:small="small"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="state.total"-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
    <!--/>-->
  <!--</el-row>-->

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
import { ElMessage } from "element-plus";
import searchBar from "@/components/SearchBar/index.vue";
const { $api } = getCurrentInstance().appContext.config.globalProperties;

const tableLoading = ref(true);
const state = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 100,
  tableData: [],
});

const totalRMB = ref(0);
const totalUSDT = ref(0);

onMounted(() => {
  getRevenue();
});

const getRevenue = () => {
  let param = {
    size: state.pageSize,
    page: state.currentPage,
  }
  $api.report
      .getRevenue(param)
      .then((res) => {
        totalRMB.value = res.data.totalRMB
        totalUSDT.value = res.data.totalUSDT
        state.tableData = res.tableData;
        tableLoading.value = false;
        state.total = res.count;
        console.log('getRevenue', res)
      });
};

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  getRevenue();
};
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  getRevenue();
};

</script>
<style lang="scss" scoped>
.card-mid {
  margin: 30px;
  height: 150px;
  text-align: center;
  div:nth-child(1) {
    margin: 8px;
    color: #0066cc;
    font-size: xx-large;
  }
  div:nth-child(2) {
    margin: 8px;
    color: #b21014;
    font-size: x-large;
  }
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

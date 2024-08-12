<template>
  <div class="table-container">
    <search-bar
            :form-config="formConfig"
            :valueForm="queryParam"
            @handleSearch="searchQuery"
            @handleReset="searchReset"
            class="bar"
    ></search-bar>
    <div class="total-row">
      <el-divider />
      <el-row class="flex-center">
        <span class="total-success">提现成功(元)：{{total_RMB.totalSuccess}}</span>
        <span class="total-failed">提现拒绝(元)：{{total_RMB.totalFail}}</span>
        <span class="total-success">今日提现成功(元)：{{total_RMB.todaySuccess}}</span>
        <span class="total-failed">今日提现拒绝(元)：{{total_RMB.todayFail}}</span>
        <span class="total-wait">待处理(元)：{{total_RMB.totalWait}}</span>
        <span>  |  排除下属统计: </span>
        <span class="total-success">提现成功(元)：{{total_RMB.nototalSuccess}}</span>
        <span class="total-success">今日提现成功(元)：{{total_RMB.notodaySuccess}}</span>
        <span class="total-success">提现成功笔数(笔)：{{total_RMB.nototalCount}}</span>
        <span class="total-success">今日提现成功笔数(笔)：{{total_RMB.notodayCount}}</span>
      </el-row>
      <el-divider />
      <el-row class="flex-center">
        <span class="total-success">提现成功(U)：{{total_USDT.totalSuccess}}</span>
        <span class="total-failed">提现拒绝(U)：{{total_USDT.totalFail}}</span>
        <span class="total-success">今日提现成功(U)：{{total_USDT.todaySuccess}}</span>
        <span class="total-failed">今日提现拒绝(U)：{{total_USDT.todayFail}}</span>
        <span class="total-wait">待处理(U)：{{total_USDT.totalWait}}</span>
        <span>  |  排除下属统计: </span>
        <span class="total-success">提现成功(U)：{{total_USDT.nototalSuccess}}</span>
        <span class="total-success">今日提现成功(U)：{{total_USDT.notodaySuccess}}</span>
        <span class="total-success">提现成功笔数(笔)：{{total_USDT.nototalCount}}</span>
        <span class="total-success">今日提现成功笔数(笔)：{{total_USDT.notodayCount}}</span>
      </el-row>
      <el-divider />
    </div>
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">扣款</el-button>
      <el-button type="danger" :icon="Close" @click="refuseWithdrawAll()" >批量拒绝</el-button>
    </div>
    <el-tabs
            v-model="activeName"
            type="card"
            class="card-tabs"
            @tab-click="handleClick"
    >
      <el-tab-pane label="待提现" name="first">
        <el-table
                ref="filterTableRef"
                size="small"
                stripe
                class="table-list"
                row-key="date"
                :data="state.tableData"
                style="width: 100%"
                v-loading="tableLoading"
                @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"/>
          <el-table-column prop="userCount" label="累计成功" width="40"/>
          <el-table-column prop="account" label="账户" width="90"/>
          <el-table-column prop="phone" label="手机号" width="90"/>
          <el-table-column prop="realName" label="姓名" width="55"/>
          <el-table-column prop="team" label="团队" width="55"/>
          <el-table-column prop="teamRoot" label="所属团队" width="55"/>
          <el-table-column prop="money" label="金额(元)" width="80"/>
          <el-table-column prop="amount" label="金额(USDT)" width="80"/>
          <el-table-column prop="fee" label="手续费(USDT)" width="80"/>
          <el-table-column prop="platform" label="提现类型" width="80"/>
          <el-table-column label="提现信息" width="250">
            <template #default="scope">
              <div v-if="scope.row.platformType == 5">
                <div>姓名：{{scope.row.name}}</div>
                <div>所属银行：{{scope.row.bankType}}</div>
                <div>卡号：{{scope.row.bankCardNo}}</div>
                <div>开户支行：{{scope.row.branch}}</div>
                <div>所在地：{{scope.row.location}}</div>
              </div>
              <div v-if="scope.row.platformType == 6">
                <div>链名：{{scope.row.network}}</div>
                <div>地址：</div>
                <div>{{scope.row.address}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="提现方式" width="40"/>
          <el-table-column prop="transStatus" label="状态" width="40"/>
          <el-table-column prop="createDate" label="申请时间" width="80"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button size="small" type="success" @click="editTransStatus(scope.$index, scope.row)">已打款</el-button>
              <el-button size="small" type="danger" @click="refuseWithdraw(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="历史提现" name="second">
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
          <el-table-column prop="userCount" label="累计成功" width="40"/>
          <el-table-column prop="account" label="账户" width="90"/>
          <el-table-column prop="phone" label="手机号" width="90"/>
          <el-table-column prop="realName" label="姓名" width="55"/>
          <el-table-column prop="team" label="团队" width="55"/>
          <el-table-column prop="teamRoot" label="所属团队" width="55"/>
          <el-table-column prop="money" label="金额(元)" width="80"/>
          <el-table-column prop="amount" label="金额(USDT)" width="80"/>
          <el-table-column prop="fee" label="手续费(USDT)" width="80"/>
          <el-table-column prop="platform" label="提现类型" width="80"/>
          <el-table-column label="提现信息" width="270">
            <template #default="scope">
              <div v-if="scope.row.platformType == 5">
                <div>姓名：{{scope.row.name}}</div>
                <div>所属银行：{{scope.row.bankType}}</div>
                <div>卡号：{{scope.row.bankCardNo}}</div>
                <div>开户支行：{{scope.row.branch}}</div>
                <div>所在地：{{scope.row.location}}</div>
              </div>
              <div v-if="scope.row.platformType == 6">
                <div>链名：{{scope.row.network}}</div>
                <div>地址：</div>
                <div>{{scope.row.address}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="提现方式" width="40">
            <template #default="scope">
              <span style="color:red" v-if="scope.row.payType == '线下扣款'">{{scope.row.payType}}</span>
              <span v-else>{{scope.row.payType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="transStatus" label="处理结果" width="40"/>
          <el-table-column prop="createDate" label="申请时间" width="80"/>
          <el-table-column prop="explain" label="说明" width=""/>
          <el-table-column prop="managerName" label="操作人" width="55"/>
          <el-table-column label="查看" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" v-if="scope.row.image" @click="imageDialog(scope.$index, scope.row)">查看凭证</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
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
          @updateList="getWaitWithdrawList"
          @closeModal="isAddShow = false"
  />
  <info-modal
          :addVisible="isInfoShow"
          @closeModal="isInfoShow = false"
          :info="editInfo"
  />
  <refuse-modal
          :addVisible="isRefuseShow"
          @updateList="getWaitWithdrawList"
          @closeModal="isRefuseShow = false"
          :info="refuseInfo"
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
  import {Plus, Close} from '@element-plus/icons-vue'
  import addModal from "./module/add.vue";
  import infoModal from "./module/info.vue";
  import refuseModal from "./module/refuse.vue";
  import store from "@/store";
  import searchBar from "@/components/SearchBar/index.vue";
  import { ElMessage} from "element-plus";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  const isAddShow = ref(false);
  const isInfoShow = ref(false);
  const isRefuseShow = ref(false);
  const editInfo = ref();
  const refuseInfo = ref();
  const filterTableRef = ref();
  const tableLoading = ref(true);
  const activeName = ref('first')
  const state = reactive({
    tableData: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

  const multipleSelection = ref([]);
  const handleSelectionChange = (val) => {
    console.log('handleSelectionChange:', val)
    multipleSelection.value = val
  }

  const formConfig = reactive({
    // 搜索栏配置项
    formItemList: [
      { type: "input", placeholder: "手机号", key: "phone" },
      { type: "input", placeholder: "账户", key: "account" },
      { type: "input", placeholder: "订单号", key: "order" },
      {
        type: "select",
        key: "payType", // 表单域model字段 必填
        placeholder: "提现方式",
        options: [
          {
            value: -1,
            name: "全部",
          },
          {
            value: 1,
            name: "线上提现",
          },
          {
            value: 2,
            name: "线下扣款",
          },
        ],
      },
      {
        type: "select",
        key: "platform", // 表单域model字段 必填
        placeholder: "提现类型",
        options: [
          {
            value: -1,
            name: "全部",
          },
          {
            value: 0,
            name: "币币支付",
          },
          {
            value: 5,
            name: "银行卡支付",
          },
        ],
      },
    ],
  });
  const queryParam = reactive({
    //搜索表单
    phone: "",
    account: "",
    order: "",
    payType: -1,
    platform: -1,
  });
  const total_RMB = reactive({
    totalSuccess: 0,
    totalFail: 0,
    todaySuccess: 0,
    todayFail: 0,
    totalWait: 0,
    nototalSuccess: 0,
    notodaySuccess: 0,
    nototalCount: 0,
    notodayCount: 0,
  });
  const total_USDT = reactive({
    totalSuccess: 0,
    totalFail: 0,
    todaySuccess: 0,
    todayFail: 0,
    totalWait: 0,
    nototalSuccess: 0,
    notodaySuccess: 0,
    nototalCount: 0,
    notodayCount: 0,
  });

  // 初始化加载
  onMounted(() => {
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      phone: queryParam.phone,
      account: queryParam.account,
      order: queryParam.order,
      payType: queryParam.payType,
      platform: queryParam.platform,
    }
    getWaitWithdrawList(param);
    getWithdrawSta();
    getWithdrawUsdtSta();
  });

  // methods
  const handleClick = (tab, event) => {
    activeName.value = tab.paneName
    console.log(activeName.value)
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      phone: queryParam.phone,
      account: queryParam.account,
      order: queryParam.order,
      payType: queryParam.payType,
      platform: queryParam.platform,
    }
    if (tab.paneName === 'first') {
      getWaitWithdrawList(param);
    }
    else if (tab.paneName === 'second') {
      getHistoryWithdrawList(param);
    }
  }

  // 修改交易状态
  const editTransStatus = (index, row) => {
    let param = {
      id:row.id,
      transStatus: 2,
      desType: '',
    }
    $api.trans
            .edit_trans_status(param)
            .then((res) => {
              if (res.result) {
                ElMessage({
                  type: "success",
                  showClose: true,
                  message: "成功",
                });
              }
            })
            .finally(() => {
              let param = {
                size: state.pageSize,
                page: state.currentPage,
                phone: queryParam.phone,
                account: queryParam.account,
                order: queryParam.order,
                payType: queryParam.payType,
                platform: queryParam.platform,
              }
              getWaitWithdrawList(param);
            });
  }

  // 充值统计
  const getWithdrawSta = (param) => {
    $api.trans
            .getWithdrawSta(param)
            .then((res) => {
              console.log("getWithdrawSta", res)
              total_RMB.totalSuccess = res.data.totalSuccess
              total_RMB.totalFail = res.data.totalFail
              total_RMB.totalWait = res.data.totalWait
              total_RMB.todaySuccess = res.data.todaySuccess
              total_RMB.todayFail = res.data.todayFail
              total_RMB.nototalSuccess = res.data.nototalSuccess
              total_RMB.notodaySuccess = res.data.notodaySuccess
              total_RMB.nototalCount = res.data.nototalCount
              total_RMB.notodayCount = res.data.notodayCount
            });
  };

  const getWithdrawUsdtSta = (param) => {
    $api.trans
            .getWithdrawUsdtSta(param)
            .then((res) => {
              console.log("getWithdrawUsdtSta", res)
              total_USDT.totalSuccess = res.data.totalSuccess
              total_USDT.totalFail = res.data.totalFail
              total_USDT.totalWait = res.data.totalWait
              total_USDT.todaySuccess = res.data.todaySuccess
              total_USDT.todayFail = res.data.todayFail
              total_USDT.nototalSuccess = res.data.nototalSuccess
              total_USDT.notodaySuccess = res.data.notodaySuccess
              total_USDT.nototalCount = res.data.nototalCount
              total_USDT.notodayCount = res.data.notodayCount
            });
  };

  // 获取待提现
  const getWaitWithdrawList = (param) => {
    $api.trans
            .getWaitWithdrawList(param)
            .then((res) => {
              state.tableData = res.data;
              console.log("getWaitWithdrawList", res);
              tableLoading.value = false;
              state.total = res.count;
            });
  };
  // 获取历史提现
  const getHistoryWithdrawList = (param) => {
    $api.trans
            .getHistoryWithdrawList(param)
            .then((res) => {
              state.tableData = res.data;
              console.log("getHistoryWithdrawList", res);
              tableLoading.value = false;
              state.total = res.count;
            });
  };

  const searchQuery = (val) => {
    console.log("searchQuery", val)
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      phone: val.phone,
      account: val.account,
      order: val.order,
      payType: val.payType,
      platform: val.platform,
    }
    if (activeName.value === 'first') {
      getWaitWithdrawList(param);
    }
    else if (activeName.value === 'second') {
      getHistoryWithdrawList(param);
    }
  };
  const searchReset = () => {
    console.log("searchReset");
  };

  // 查看凭证
  const imageDialog = (index, row) => {
    isInfoShow.value = true;
    editInfo.value= row;
  };

  // 拒绝
  const refuseWithdraw = (index, row) => {
    isRefuseShow.value = true;
    refuseInfo.value= {ids: [row.id]};
  };

  // 批量拒绝
  const refuseWithdrawAll = () => {
    let ids = new Array();
    for (let i in multipleSelection.value) {
      ids.push(multipleSelection.value[i].id)
    }
    if (ids.length > 0) {
      isRefuseShow.value = true;
      refuseInfo.value= {ids: ids};
    }
  };

  const handleSizeChange = (val) => {
    console.log(`每页 ${val} 条`);
    state.pageSize = val;
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      phone: queryParam.phone,
      account: queryParam.account,
      order: queryParam.order,
      payType: queryParam.payType,
      platform: queryParam.platform,
    }
    getWaitWithdrawList(param);
  };
  const handleCurrentChange = (val) => {
    console.log(`当前页: ${val}`);
    state.currentPage = val;
    let param = {
      size: state.pageSize,
      page: state.currentPage,
      phone: queryParam.phone,
      account: queryParam.account,
      order: queryParam.order,
      payType: queryParam.payType,
      platform: queryParam.platform,
    }
    getWaitWithdrawList(param);
  };
</script>
<style lang="scss" scoped>
  .total-row {
    font-size: 0.85rem;
    margin-top: -20px;
    padding: 0px 10px 0px 20px;
    span {
      margin-left: 5px;
    }
  }
  .total-success {
    color: blue;
  }
  .total-failed {
    color: red;
  }
  .total-wait {
    color: green;
  }
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
    .card-tabs {
      padding: 10px 20px 0px 20px;
    }
  }

  :deep(.el-table .warning-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
  }
</style>

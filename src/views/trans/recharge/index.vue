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
        <span class="total-success">充值成功(元)：{{total_RMB.totalSuccess}}</span>
        <span class="total-failed">充值失败(元)：{{total_RMB.totalFail}}</span>
        <span class="total-success">今日充值成功(元)：{{total_RMB.todaySuccess}}</span>
        <span class="total-failed">今日充值失败(元)：{{total_RMB.todayFail}}</span>
        <span>  |  排除下属统计: </span>
        <span class="total-success">充值成功(元)：{{total_RMB.nototalSuccess}}</span>
        <span class="total-success">今日充值成功(元)：{{total_RMB.notodaySuccess}}</span>
        <span class="total-success">充值成功笔数(笔)：{{total_RMB.nototalCount}}</span>
        <span class="total-success">今日充值成功笔数(笔)：{{total_RMB.notodayCount}}</span>
      </el-row>
      <el-divider />
      <el-row class="flex-center">
        <span class="total-success">充值成功(U)：{{total_USDT.totalSuccess}}</span>
        <span class="total-failed">充值失败(U)：{{total_USDT.totalFail}}</span>
        <span class="total-success">今日充值成功(U)：{{total_USDT.todaySuccess}}</span>
        <span class="total-failed">今日充值失败(U)：{{total_USDT.todayFail}}</span>
        <span>  |  排除下属统计: </span>
        <span class="total-success">充值成功(U)：{{total_USDT.nototalSuccess}}</span>
        <span class="total-success">今日充值成功(U)：{{total_USDT.notodaySuccess}}</span>
        <span class="total-success">充值成功笔数(笔)：{{total_USDT.nototalCount}}</span>
        <span class="total-success">今日充值成功笔数(笔)：{{total_USDT.notodayCount}}</span>
      </el-row>
      <el-divider />
    </div>
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true">充值</el-button>
      <!--<el-button type="danger" :icon="Close" @click="deleteRecharges()" >批量删除</el-button>-->
      <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="el-icon-info"
          icon-color="red"
          title="确定要删除吗？"
          @confirm="deleteRecharges()"
      >
        <template #reference>
          <el-button :icon="Close" type="danger">批量删除</el-button>
        </template>
      </el-popconfirm>
    </div>
    <el-tabs
            v-model="activeName"
            type="card"
            class="card-tabs"
            @tab-click="handleClick"
    >
      <el-tab-pane label="待充值" name="first">
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
          <el-table-column prop="account" label="账户" width="90"/>
          <el-table-column prop="phone" label="手机号" width="90"/>
          <el-table-column prop="realName" label="姓名" width="55"/>
          <el-table-column prop="team" label="团队" width="55"/>
          <el-table-column prop="teamRoot" label="所属团队" width="55"/>
          <el-table-column prop="money" label="金额(元)" width="60"/>
          <el-table-column prop="amount" label="金额(USDT)" width="80"/>
          <el-table-column prop="fee" label="手续费(USDT)" width="60"/>
          <el-table-column prop="commission" label="返佣(USDT)" width="60"/>
          <el-table-column prop="payType" label="充值方式" width="20">
            <template #default="scope">
              <span style="color:red" v-if="scope.row.payType == '线下充值'">{{scope.row.payType}}</span>
              <span v-else>{{scope.row.payType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="充值平台" width="20"/>
          <el-table-column prop="orderId" label="平台订单号"  width="100"/>
          <el-table-column prop="name" label="付款人" width="130"/>
          <el-table-column prop="transStatus" label="状态" width="20"/>
          <el-table-column prop="createDate" label="提交时间" width="80"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <!--<el-button size="small" type="success" @click="queryTransStatus(scope.$index, scope.row)">主动查询</el-button>-->
              <el-popconfirm
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      icon="el-icon-info"
                      icon-color="red"
                      title="确定上分吗？"
                      @confirm="confirmRecharge(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="primary">确定上分</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="历史充值" name="second">
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
          <el-table-column prop="account" label="账户" width="90"/>
          <el-table-column prop="phone" label="手机号" width="90"/>
          <el-table-column prop="realName" label="姓名" width="55"/>
          <el-table-column prop="team" label="团队" width="55"/>
          <el-table-column prop="teamRoot" label="所属团队" width="55"/>
          <el-table-column prop="money" label="金额(元)" width="60"/>
          <el-table-column prop="amount" label="金额(USDT)" width="80"/>
          <el-table-column prop="fee" label="手续费(USDT)" width="60"/>
          <el-table-column prop="commission" label="返佣(USDT)" width="60"/>
          <el-table-column prop="payType" label="充值方式" width="40">
            <template #default="scope">
              <span style="color:red" v-if="scope.row.payType == '线下充值'">{{scope.row.payType}}</span>
              <span v-else>{{scope.row.payType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="充值平台" width="40"/>
          <el-table-column prop="orderId" label="平台订单号"  width="120"/>
          <el-table-column prop="name" label="付款人" width="160"/>
          <el-table-column prop="transStatus" label="状态" width="40"/>
          <el-table-column prop="createDate" label="提交时间" width="80"/>
          <el-table-column prop="explain" label="说明"/>
          <el-table-column prop="managerName" label="操作人" width="55"/>
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
          @updateList="getHistoryTransList"
          @closeModal="isAddShow = false"
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
  import store from "@/store";
  import searchBar from "@/components/SearchBar/index.vue";
  import { ElMessage} from "element-plus";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  const isAddShow = ref(false);
  const isEditShow = ref(false);
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
        placeholder: "充值方式",
        options: [
          {
            value: -1,
            name: "全部",
          },
          {
            value: 1,
            name: "线上充值",
          },
          {
            value: 2,
            name: "线下充值",
          },
        ],
      },
      {
        type: "select",
        key: "platform", // 表单域model字段 必填
        placeholder: "充值平台",
        options: [
          {
            value: -1,
            name: "全部",
          },
          {
            value: 0,
            name: "币币充值",
          },
          {
            value: 4,
            name: "新云支付",
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
    nototalSuccess: 0,
    notodaySuccess: 0,
    nototalCount: 0,
    notodayCount: 0,
  });
  const editInfo = ref();

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
    getWaitTransList(param);
    getRechargeSta();
    getRechargeUsdtSta();
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
      getWaitTransList(param);
    }
    else if (tab.paneName === 'second') {
      getHistoryTransList(param);
    }
  }

  // 删除记录
  const deleteRecharges = () => {
    let ids = new Array();
    for (let i in multipleSelection.value) {
      ids.push(multipleSelection.value[i].id)
    }
    if (ids.length > 0) {
      console.log(JSON.stringify(ids))
      $api.trans
              .deleteRecharge({ids: JSON.stringify(ids)})
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
                getWaitTransList(param);
              });
    }
  }

  // 充值统计
  const getRechargeSta = (param) => {
    $api.trans
            .getRechargeSta(param)
            .then((res) => {
              console.log("getRechargeSta", res)
              total_RMB.totalSuccess = res.data.totalSuccess
              total_RMB.totalFail = res.data.totalFail
              total_RMB.todaySuccess = res.data.todaySuccess
              total_RMB.todayFail = res.data.todayFail
              total_RMB.nototalSuccess = res.data.nototalSuccess
              total_RMB.notodaySuccess = res.data.notodaySuccess
              total_RMB.nototalCount = res.data.nototalCount
              total_RMB.notodayCount = res.data.notodayCount
            });
  };

  const getRechargeUsdtSta = (param) => {
    $api.trans
            .getRechargeUsdtSta(param)
            .then((res) => {
              console.log("getRechargeUsdtSta", res)
              total_USDT.totalSuccess = res.data.totalSuccess
              total_USDT.totalFail = res.data.totalFail
              total_USDT.todaySuccess = res.data.todaySuccess
              total_USDT.todayFail = res.data.todayFail
              total_USDT.nototalSuccess = res.data.nototalSuccess
              total_USDT.notodaySuccess = res.data.notodaySuccess
              total_USDT.nototalCount = res.data.nototalCount
              total_USDT.notodayCount = res.data.notodayCount
            });
  };

  // 获取待充值
  const getWaitTransList = (param) => {
    $api.trans
            .getWaitTransList(param)
            .then((res) => {
              state.tableData = res.data;
              console.log("getWaitTransList", res);
              tableLoading.value = false;
              state.total = res.count;
            });
  };
  // 获取历史充值
  const getHistoryTransList = (param) => {
    $api.trans
            .getHistoryTransList(param)
            .then((res) => {
              state.tableData = res.data;
              console.log("getHistoryTransList", res);
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
      getWaitTransList(param);
    }
    else if (activeName.value === 'second') {
      getHistoryTransList(param);
    }
  };
  const searchReset = () => {
    console.log("searchReset");
  };

  // 主动查询
  const queryTransStatus = (index, row) => {
    let param = {
      id:row.id
    }
    $api.trans
            .query_trans_status(param)
            .then((res) => {
              console.log("queryTransStatus", res);
              if (res.result) {
                ElMessage({
                  type: "success",
                  showClose: true,
                  message: "成功",
                });
              } else {
                ElMessage({
                  type: "error",
                  showClose: true,
                  message: "失败",
                });
              }
              let param = {
                size: state.pageSize,
                page: state.currentPage,
                phone: queryParam.phone,
                account: queryParam.account,
                order: queryParam.order,
                payType: queryParam.payType,
                platform: queryParam.platform,
              }
              getWaitTransList(param);
            });
  };

  // 确定上分
  const confirmRecharge = (index, row) => {
    let param = {
      id:row.id
    }
    $api.trans
            .confirm_recharge(param)
            .then((res) => {
              console.log("confirmRecharge", res);
              ElMessage({
                type: "success",
                showClose: true,
                message: "成功",
              });
              let param = {
                size: state.pageSize,
                page: state.currentPage,
                phone: queryParam.phone,
                account: queryParam.account,
                order: queryParam.order,
                payType: queryParam.payType,
                platform: queryParam.platform,
              }
              getWaitTransList(param);
            });
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
    if (activeName.value === 'first') {
      getWaitTransList(param);
    }
    else if (activeName.value === 'second') {
      getHistoryTransList(param);
    }
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
    if (activeName.value === 'first') {
      getWaitTransList(param);
    }
    else if (activeName.value === 'second') {
      getHistoryTransList(param);
    }
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

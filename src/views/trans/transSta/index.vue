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
        <span>  排除下属: </span>
        <span class="total-success">线上充值成功(元)：{{total_RMB.pay1Recharge}}</span>
        <span class="total-failed">线下充值成功(元)：{{total_RMB.pay2Recharge}}</span>
        <span class="total-success">线上提现成功(元)：{{total_RMB.pay1Withdraw}}</span>
        <span class="total-wait">线上提现待处理(元)：{{total_RMB.waitWithdraw}}</span>
        <span class="total-success">提现成功人数：{{total_RMB.successWithdrawCount}}</span>
        <span class="total-wait">提现待处理人数：{{total_RMB.waitWithdrawCount}}</span>
        <span class="total-success">已冻结账户数量：{{total_RMB.isNormalCount}}</span>
      </el-row>
    </div>
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
  import {Plus, Close} from '@element-plus/icons-vue'
  import searchBar from "@/components/SearchBar/index.vue";
  import { ElMessage} from "element-plus";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  const formConfig = reactive({
    // 搜索栏配置项
    formItemList: [
      {
        type: "datetimerange",
        key: "rangeTime",
        placeholder: ["开始时间", "结束时间"],
      },
    ],
  });
  const queryParam = reactive({
    //搜索表单
    rangeTime: "",
  });
  const total_RMB = reactive({
    pay1Recharge: 0,
    pay1Withdraw: 0,
    pay2Recharge: 0,
    pay2Withdraw: 0,
    successWithdrawCount: 0,
    waitWithdraw: 0,
    waitWithdrawCount: 0,
    isNormalCount: 0,
  });

  // 初始化加载
  onMounted(() => {
    getSta();
  });

  // methods

  // 充提统计
  const getSta = (param) => {
    $api.trans
            .getSta(param)
            .then((res) => {
              console.log("getSta", res)
              total_RMB.pay1Recharge = res.data.pay1Recharge
              total_RMB.pay1Withdraw = res.data.pay1Withdraw
              total_RMB.pay2Recharge = res.data.pay2Recharge
              total_RMB.pay2Withdraw = res.data.pay2Withdraw
              total_RMB.successWithdrawCount = res.data.successWithdrawCount
              total_RMB.waitWithdraw = res.data.waitWithdraw
              total_RMB.waitWithdrawCount = res.data.waitWithdrawCount
              total_RMB.isNormalCount = res.data.isNormalCount
            });
  };
  const searchQuery = (val) => {
    console.log("searchQuery", val)
    let param = {
      startTime: val.rangeTime / 1000,
      endTime: val.rangeTime / 1000,
    }
    getSta(param);
  };
  const searchReset = () => {
    console.log("searchReset");
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

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="right"
    label-width="300px"
  >

  <el-form-item label="近7日收益率(%)(前端显示)" prop="show_percent">
    <el-input v-model="form.show_percent"></el-input>
  </el-form-item>

  <el-form-item label="24小时实际收益百分比(%)" prop="profit_percent">
    <el-input v-model="form.profit_percent"></el-input>
  </el-form-item>

  <el-form-item label="24小时实际收益固定值(USDT)" prop="profit_fixation">
    <el-input v-model="form.profit_fixation"></el-input>
  </el-form-item>

  <el-form-item label="限制收益最低金额(USDT)(低于该值将不计入收益)" prop="profit_min">
    <el-input v-model="form.profit_min"></el-input>
  </el-form-item>

  <el-form-item label="每次转入金额限制(USDT)" prop="in">
    <div class='flex' >
      <el-input v-model="form.in_min"></el-input>-<el-input v-model="form.in_max"></el-input>
    </div>
  </el-form-item>

  <el-form-item label="每次转出金额限制(USDT)" prop="out">
    <div class='flex' >
      <el-input v-model="form.out_min"></el-input>-<el-input v-model="form.out_max"></el-input>
    </div>
  </el-form-item>

  <el-form-item label=" 钱包规则" prop="wallet_rules">
    <el-input
      v-model="form.wallet_rules"
      :rows="10"
      type="textarea"
      placeholder=""
    />
  </el-form-item>

    <el-row class="btn-container">
      <el-button
        size="small"
        type="primary"
        :loading="addLoading"
        @click="submitForm()"
      >
        <i class="fa fa-plus"> </i> 保存
      </el-button>
    </el-row>
  </el-form>
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
import mixin from "@/mixins/list.js";
import { ElMessage } from "element-plus";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const router = useRouter();
const filterTableRef = ref();
const rowUserId = ref();
const state = reactive({
  currencyList:[]
})
const form = reactive({
  content:"",
  depth_symbol_id:"",
  profit_rules:"",
  proxy1profit:"",
  proxy2profit:"",
  status:"",
  symbol_id:"",
});
const dialogFormVisible = ref(true);
onMounted(() => {
  getWalletSet();
});
const tableRowClassName = (e) => {
  let { row, rowIndex } = e;
  // console.log(row, rowIndex, store.state.app.userInfo.username);
  if (row.name == store.state.app.userInfo.username) {
    return "warning-row";
  }
  return "";
};

const getWalletSet = () => {
  $api.wallet
    .getWalletSet({})
    .then((res) => {
      form.in_min = res.data.in_min
      form.in_max = res.data.in_max
      form.out_min = res.data.out_min
      form.out_max = res.data.out_max
      form.profit_min = res.data.profit_min

      form.show_percent = res.data.show_percent
      form.profit_percent = res.data.profit_percent
      form.profit_fixation = res.data.profit_fixation
      form.wallet_rules = res.data.wallet_rules
    });
};

const submitForm = () => {
  $api.wallet
    .editWalletSet(form)
    .then((res) => {
      ElMessage("操作成功")
      getWalletSet()
    })
}

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

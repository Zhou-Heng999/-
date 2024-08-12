<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="right"
    label-width="200px"
  >
    <el-form-item label="矿机K线币种" prop="p_index">
      <el-select v-model="form.symbol_id" defaultSelect="form.symbol_id">
        <el-option
          v-for="item in state.currencyList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="买卖挂单币种" prop="p_index">
      <el-select v-model="form.depth_symbol_id" defaultSelect="form.depth_symbol_id">
        <el-option
          v-for="item in state.currencyList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="币种简介" prop="phone">
      <el-input
        v-model="form.content"
        :rows="10"
        type="textarea"
        placeholder="请输入手机号"
      />
    </el-form-item>

    <el-form-item label="一代好友加成(TRX/小时)" prop="username">
      <el-input
        v-model="form.proxy1profit"
      ></el-input>
    </el-form-item>

    <el-form-item label="二代好友加成(TRX/小时)" prop="username">
      <el-input
        v-model="form.proxy2profit"
      ></el-input>
    </el-form-item>

    <el-form-item label="提升规则" prop="phone">
      <el-input
        v-model="form.profit_rules"
        :rows="10"
        type="textarea"
        placeholder="请输入提升规则"
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
  getNonCurrencyList();
  getProductSet();
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
const getNonCurrencyList = () => {
  $api.currency
    .getNonCurrencyList({})
    .then((res) => {
      state.currencyList = res.data;
    });
};

const getProductSet = () => {
  $api.mining
    .getProductSet({})
    .then((res) => {
      form.content = res.data.content
      form.depth_symbol_id = res.data.depth_symbol_id
      form.profit_rules = res.data.profit_rules
      form.proxy1profit = res.data.proxy1profit
      form.proxy2profit = res.data.proxy2profit
      form.symbol_id = res.data.symbol_id
    });
};

const submitForm = () => {
  $api.mining
    .editProductSet(form)
    .then((res) => {
      ElMessage("操作成功")
      getProductSet()
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

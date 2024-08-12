<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="follow.getOrderList"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'profit_status'">
        <el-tag v-if="scope.row.profit_status == 1" type="success">盈利</el-tag>
        <el-tag v-else-if="scope.row.profit_status == 2" type="danger"
          >亏损</el-tag
        >
        <el-tag v-else type="success"></el-tag>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'name'">
        {{ scope.row.name }}({{ scope.row.text }})
      </slot>
    </template>
    <template #leftView> </template>
  </table-modal>
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
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const { num, exportExcel } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isDetailShow = ref(false);
const router = useRouter();
const dialogFormVisible = ref(true);
const formInline = reactive({
  user: "",
  region: "",
});

const column = [
  { title: "序号", key: "id" },
  { title: "账号", key: "account" },
  { title: "买入时间", key: "create_date" },
  { title: "周期(秒)", key: "term_value" },
  { title: "币种", key: "name", isNeedSlot: true },
  { title: "价格(USDT)", key: "buy_price" },
  { title: "总金额(USDT)", key: "deposit" },
  { title: "收益(USDT)", key: "commission" },
  { title: "手续费(USDT)", key: "fee" },
  { title: "收益状态", key: "profit_status", isNeedSlot: true },
  { title: "卖出时间", key: "sell_date" },
  { title: "赔付金额(USDT)", key: "compensation" },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [
    { type: "input", placeholder: "账号", key: "account" },
    { type: "input", placeholder: "ip", key: "ip" },
    { type: "input", placeholder: "手机尾号", key: "phone" },
    {
      type: "datetimerange",
      key: ["star_time", "end_time"],
      placeholder: ["开始时间", "结束时间"],
    },
  ],
});
const queryParam = reactive({
  //搜索表单
  account: "",
  ip: "",
  phone: "",
});
const editInfo = ref();

// methods
const onSubmit = () => {
  // eslint-disable-next-line no-console
  console.log("submit!");
};
</script>
<style lang="scss" scoped></style>

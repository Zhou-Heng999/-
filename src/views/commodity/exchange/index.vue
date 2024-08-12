<template>
  <table-modal
    :tableHeader="column"
    :formConfig="formConfig"
    :valueForm="queryParam"
    tableUrl="items.order_list"
    ref="tableRef"
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
      </slot>
      <slot v-if="scope.row && scope.row.key == 'order_status'">
        <el-tag v-if="scope.row.order_status == 0">进行中</el-tag>
        <el-tag v-else type="success">已完成</el-tag>
      </slot>
    </template>
    <template #leftView> </template>
  </table-modal>

  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="$upTableList(tableRef)"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
</template>
<script setup>
import editModal from "./module/edit.vue";

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
const tableRef = ref(null);
const isEditShow = ref(false);
const handleEdit = (index, row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
};
const column = [
  { title: "订单号", key: "order_no" },
  { title: "订单时间", key: "create_date" },
  { title: "玩家ID", key: "user_id" },
  { title: "玩家当时积分", key: "user_jf" },
  { title: "收货人", key: "address_name" },
  { title: "收货人手机号码", key: "address_phone" },
  { title: "收货地址", key: "address" },
  { title: "兑换商品ID", key: "item_id" },
  { title: "兑换商品名称", key: "item_name" },
  { title: "兑换商品积分", key: "item_jf" },
  { title: "兑换数量", key: "item_num" },
  { title: "订单状态", key: "order_status", isNeedSlot: true },
  { title: "备注", key: "remark" },
  { title: "4", key: "edit_row" },
];
const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [{ type: "input", placeholder: "账号", key: "account" }],
});
const queryParam = reactive({
  //搜索表单
  account: "",
});
const editInfo = ref();

// methods
const onSubmit = () => {
  // eslint-disable-next-line no-console
  console.log("submit!");
};
</script>
<style lang="scss" scoped></style>

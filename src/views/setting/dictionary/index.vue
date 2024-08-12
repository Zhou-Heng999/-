<template>
  <table-modal
    :btnList="btnList"
    :tableHeader="column"
    @btnClick="btnClick"
    tableUrl="dictionary.list"
    ref="tableRef"
    isCheckMore
  >
    <template #default="scope">
      <slot v-if="scope.row && scope.row.key == 'edit_row'">
        <el-space>
          <el-icon @click="editInfo(scope.row)"><Edit /></el-icon>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
              title="确定删除吗？" @confirm="delInfo(scope.row)">
              <template #reference>
                  <!-- <el-button size="small" type="danger">删除</el-button> -->
                  <el-icon><Delete /></el-icon>
              </template>
          </el-popconfirm>
        </el-space>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'status'">
        <el-tag :type="statusList[scope.row.status].type">{{
          statusList[scope.row.status].label
        }}</el-tag>
      </slot>
      <slot v-if="scope.row && scope.row.key == 'itemList'">
        <el-space>
          <el-tag v-for="item in scope.row.itemList" :type="item.color">{{
            item.name
          }}</el-tag>
        </el-space>
      </slot>
    </template>
  </table-modal>
  <!-- <div @click="getAllRow">获取选中的</div> -->

  <add-modal
    :addVisible="isAddShow"
    :type="modalType"
    :info="itemInfo"
    @closeModal="closeModal"
    @updateList="up"
  />
</template>

<script setup>
import i18n from "@/locales/index";
import addModal from "./module/add.vue";

import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { Delete, View, Edit } from "@element-plus/icons-vue";

const t = i18n.global.t;

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const { proxy, ctx } = getCurrentInstance();

const queryParam = reactive({
  //搜索表单
  name: "",
  account_id: "",
  status: "",
  search: "",
});
const modalType = ref("add");
const column = [
  { title: "549", key: "id" },
  { title: "550", key: "name" },
  { title: "551", key: "type" },
  { title: "552", key: "status", isNeedSlot: true },
  { title: "553", key: "itemList", isNeedSlot: true, width: 500 },

  { title: "95", key: "remark" },
  { title: 4, key: "edit_row", isNeedSlot: true },
];
const statusList = {
  0: { label: t("554"), value: "0", type: "info" },
  1: { label: t("555"), value: "1", type: "success" },
};
const tableRef = ref(null);
const updateList = (val) => {
  // tableRef.value[0].getTableList();
  console.log(tableRef.value);
};
const up = () => {
  proxy.$refs["tableRef"].getTableList();
};
const getAllRow = () => {
  proxy.$refs["tableRef"].getCheckMoreList();
};

// 编辑
const itemInfo = ref(null);
const editInfo = (val) => {
  console.log(val);

  itemInfo.value = val;
  modalType.value = "update";
  isAddShow.value = true;
};

const delInfo = (val) => {
  console.log(val);
  $api.dictionary.del({
    id: val.id
  }).then((res) => {
        ElMessage({
          type: "success",
          showClose: true,
          message: '删除成功',
        });
      })
      .finally(() => {
        up();
      });
};

// 关闭
const closeModal = () => {
  isAddShow.value = false;
  modalType.value = "add";
};
const isAddShow = ref(false);
const btnClick = ({ type }) => {
  if (type == "add") {
    isAddShow.value = true;
  }
};
const btnList = [{ title: t("1"), type: "add", btnType: "success" }];
onMounted(() => {
  // getList();
});

// methods
</script>
<style lang="scss" scoped></style>

<template>
  <div class="table-container">
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >添加币种</el-button
      >
    </div>

    <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="idx" label="排序号"> </el-table-column>
      <el-table-column prop="symbol" label="质押币种"></el-table-column>
      <el-table-column prop="min_pledge" label="最低质押"></el-table-column>
      <el-table-column prop="other_json" label="周期(天)/日化利率(%)">
        <template #default="scope">
          <div v-for="(item, index) in scope.row.other_json" :key="index">
            周期：{{ item.day }}天; 日化利率：{{ item.rates }}%
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="is_online" label="是否上线">
        <template #default="scope">
          <el-button
            size="small"
            :type="scope.row.is_online == 1 ? 'success' : 'warning'"
          >
            {{ scope.row.is_online == 1 ? "上线" : "下线" }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template #default="scope">
          <el-button
            size="small"
            :type="scope.row.is_online == 1 ? 'warning' : 'success'"
            @click="handleOnline(scope.$index, scope.row)"
          >
            {{ scope.row.is_online == 1 ? "下线" : "上线" }}
          </el-button>
          <el-button size="small" type="info" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <add-modal
    v-if="isAddShow"
    :addVisible="isAddShow"
    @updateList="getSymbolList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="getSymbolList"
    @closeModal="isEditShow = false"
    :info="editInfo"
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
import addModal from "./module/add.vue";
import editModal from "./module/edit.vue";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const tableLoading = ref(true);
const state = reactive({
  tableData: [],
});
const editInfo = ref();

onMounted(() => {
  getSymbolList();
});

// methods
const getSymbolList = () => {
  $api.pledge.getSymbolList({}).then((res) => {
    let data = res.data;
    for (let i in data) {
      data[i].other_json = JSON.parse(data[i].other_json);
    }
    state.tableData = data;
    tableLoading.value = false;
  });
};
const handleOnline = (index, row) => {
  let param = {
    id: row.id,
    is_online: row.is_online,
  };
  $api.pledge.symbolOnline(param).then((res) => {
    ElMessage({
      type: "success",
      showClose: true,
      message: "修改成功",
    });
    getSymbolList();
  });
};
const handleEdit = (row) => {
  // eslint-disable-next-line no-console
  isEditShow.value = true;
  editInfo.value = row;
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
  .button-group {
    padding: 0 15px;
  }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

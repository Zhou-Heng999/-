<template>
  <el-dialog
    v-model="props.addVisible"
    width="1200px"
    @close="emit('closeModal')"
    title=""
  >
      <el-tabs type="border-card">
        <el-tab-pane label="一级代理">
          <el-table
            ref="filterTableRef1"
            stripe
            class="table-list"
            row-key="id"
            :data="state.tb1"
            style="width: 100%"
            v-loading="tableLoading"
            :row-class-name="tableRowClassName"
          >
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="account" label="账号"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="recharge" label="充值金额"> </el-table-column>
          <el-table-column prop="withdraw" label="提现金额"> </el-table-column>
          <el-table-column prop="money" label="产生收益"> </el-table-column>
          <el-table-column prop="proxy" label="层级"> </el-table-column>
          <el-table-column prop="create_date" label="注册时间"> </el-table-column>
        </el-table>
        <el-pagination
            v-model:currentPage="state.currentPage1"
            v-model:page-size="state.pageSize1"
            :page-sizes="[20, 100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total1"
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </el-tab-pane>

        <el-tab-pane label="二级代理">
          <el-table
            ref="filterTableRef2"
            stripe
            class="table-list"
            row-key="date"
            :data="state.tb2"
            style="width: 100%"
            v-loading="tableLoading"
            :row-class-name="tableRowClassName"
          >
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="account" label="账号"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="recharge" label="充值金额"> </el-table-column>
          <el-table-column prop="withdraw" label="提现金额"> </el-table-column>
          <el-table-column prop="money" label="产生收益"> </el-table-column>
          <el-table-column prop="proxy" label="层级"> </el-table-column>
          <el-table-column prop="create_date" label="注册时间"> </el-table-column>
        </el-table>
        <el-pagination
            v-model:currentPage="state.currentPage1"
            v-model:page-size="state.pageSize1"
            :page-sizes="[20, 100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total2"
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
        </el-tab-pane>

        <el-tab-pane label="其他代理">
          <el-table
            ref="filterTableRef3"
            stripe
            class="table-list"
            row-key="date"
            :data="state.tb3"
            style="width: 100%"
            v-loading="tableLoading"
            :row-class-name="tableRowClassName"
          >
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="account" label="账号"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="recharge" label="充值金额"> </el-table-column>
          <el-table-column prop="withdraw" label="提现金额"> </el-table-column>
          <el-table-column prop="money" label="产生收益"> </el-table-column>
          <el-table-column prop="proxy" label="层级"> </el-table-column>
          <el-table-column prop="create_date" label="注册时间"> </el-table-column>
          </el-table>
          <el-pagination
              v-model:currentPage="state.currentPage3"
              v-model:page-size="state.pageSize3"
              :page-sizes="[20, 100, 200, 300, 400]"
              :small="small"
              :disabled="disabled"
              layout="total, sizes, prev, pager, next, jumper"
              :total="state.total3"
              background
              @size-change="handleSizeChange3"
              @current-change="handleCurrentChange3"
            />
        </el-tab-pane>
      </el-tabs>
  </el-dialog>
</template>

<script setup>
import {onMounted} from "vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const tableLoading = ref(true);
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: {},
  },
  uid : "",
});
const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
});

const state = reactive({
  tb1 : [],
  currentPage1 : 1,
  pageSize1 : 20,
  total1 : 0,

  tb2 : [],
  currentPage2 : 1,
  pageSize2 : 20,
  total2 : 0,

  tb3 : [],
  currentPage3 : 1,
  pageSize3 : 20,
  total3 : 0,
})

onMounted(() => {
  tableLoading.value = true;
  getSubordinateProxyList(1);
  getSubordinateProxyList(2);
  getSubordinateProxyList(3);
  tableLoading.value = false;
});

const handleSizeChange3 = (val) => {
  state.pageSize3 = val;
  state.currentPage3 = 1;
  getSubordinateProxyList(3);
};
const handleCurrentChange3 = (val) => {
  state.currentPage3 = val;
  getSubordinateProxyList(3);
};

const handleSizeChange2 = (val) => {
  state.pageSize2 = val;
  state.currentPage2 = 1;
  getSubordinateProxyList(2);
};
const handleCurrentChange2 = (val) => {
  state.currentPage2 = val;
  getSubordinateProxyList(2);
};

const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getSubordinateProxyList(1);
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getSubordinateProxyList(1);
};

const getSubordinateProxyList = (lv) => {
  if (lv == 1) {
    $api.proxy
      .getSubordinateProxyList({
        uid : props.uid,
        page : state.currentPage1,
        size : state.pageSize1,
        type : 1,
      }).then((res) => {
        state.tb1 = res.data
        state.total1 = res.count
      })
  } else if (lv == 2) {
    $api.proxy
      .getSubordinateProxyList({
        uid : props.uid,
        page : state.currentPage2,
        size : state.pageSize2,
        type : 2,
      }).then((res) => {
        state.tb2 = res.data
        state.total2 = res.count
      })
  } else {
    $api.proxy
      .getSubordinateProxyList({
        uid : props.uid,
        page : state.currentPage3,
        size : state.pageSize3,
        type : 3,
      }).then((res) => {
        state.tb3 = res.data
        state.total3 = res.count
      })
  }
}

watch(
  () => props.info,
  (val) => {
  },
  {
    immediate: true,
    deep: true,
  }
);
const onSuccess = (val) => {};
const handleClickChoose = () => {};
</script>
<style lang="scss" scoped></style>

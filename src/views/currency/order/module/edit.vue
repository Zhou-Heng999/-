<template>
  <el-dialog
    v-model="props.addVisible"
    width="1500px"
    @close="emit('closeModal')"
    title=""
  >

  <el-descriptions
    class="margin-top"
    title="用户信息"
    :column="2"
    :size="size"
    border
  >

    <el-descriptions-item>
      <template #label><div class="cell-item">账号:</div></template>
      {{state.userinfo.account}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label><div class="cell-item">上级:</div></template>
      {{state.userinfo.parent_user_id}}
    </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">手机号:</div></template>
        {{state.userinfo.phone}}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">顶级:</div></template>
        {{state.userinfo.root_user_id}}
      </el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <el-descriptions
      class="margin-top"
      title="详细信息"
      :column="3"
      :size="size"
      border
    >
    <el-descriptions-item>
      <template #label><div class="cell-item">持有金额(USDT):</div></template>
      {{state.userinfo.balance}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label><div class="cell-item">红包金额(USDT):</div></template>
      {{state.userinfo.redPacketMoney}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label><div class="cell-item">签到金额(USDT):</div></template>
      {{state.userinfo.signMoney}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label><div class="cell-item">直推奖励(USDT):</div></template>
      {{state.userinfo.popularizeMoney}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label><div class="cell-item">累积返佣(USDT):</div></template>
      {{state.userinfo.totalCommission}}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label><div class="cell-item">赔付金额(RMB):</div></template>
      {{state.userinfo.orderCompensation}}
    </el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <el-tabs type="border-card">
      <el-tab-pane label="操作记录">
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
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column prop="create_date" label="订单时间"> </el-table-column>
        <el-table-column prop="name" label="币种名称"> </el-table-column>
        <el-table-column prop="deposit" label="保证金(USDT)/"> </el-table-column>
        <el-table-column prop="commission" label="收益(USDT)"> </el-table-column>
        <el-table-column prop="order_status" label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.order_status==1" effect="dark" color="green" round type="success">收益中</el-tag>
            <el-tag v-else effect="dark" color="blue" round type="danger">已完成</el-tag>
          </template>
        </el-table-column>
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

      <el-tab-pane label="一级代理">
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
        <el-table-column prop="create_date" label="订单时间"> </el-table-column>
        <el-table-column prop="name" label="币种名称"> </el-table-column>
        <el-table-column prop="deposit" label="保证金(USDT)/"> </el-table-column>
        <el-table-column prop="proxy_commission1" label="收益(USDT)"> </el-table-column>
        </el-table>
        <el-pagination
            v-model:currentPage="state.currentPage2"
            v-model:page-size="state.pageSize2"
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

      <el-tab-pane label="二级代理">
        <el-table
          ref="filterTableRef3"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb4"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >
        <el-table-column prop="id" label="id"> </el-table-column>
        <el-table-column prop="account" label="账号"> </el-table-column>
        <el-table-column prop="create_date" label="订单时间"> </el-table-column>
        <el-table-column prop="name" label="币种名称"> </el-table-column>
        <el-table-column prop="deposit" label="保证金(USDT)/"> </el-table-column>
        <el-table-column prop="proxy_commission2" label="收益(USDT)"> </el-table-column>
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
import { ElMessage } from 'element-plus'
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info : {},
  uid: {
    type: Object,
    default: {},
  },
});
const addVisible = ref(true);
const editLoading = ref(false);

const formRef = ref();
const loading = ref(false);
const form = reactive({
  uid: "",
});

const state = reactive({
  userinfo : {},

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
});

onMounted(() => {
  getPlayerInfo(props.info.user_id);
  getUserOrderList(props.info.user_id);
  getUserOrderProxyList2(props.info.user_id);
  getUserOrderProxyList1(props.info.user_id);
});

const handleSizeChange3 = (val) => {
  state.pageSize3 = val;
  state.currentPage3 = 1;
  getUserOrderProxyList2();
};
const handleCurrentChange3 = (val) => {
  state.currentPage3 = val;
  getUserOrderProxyList2();
};

const handleSizeChange2 = (val) => {
  state.pageSize2 = val;
  state.currentPage2 = 1;
  getUserOrderProxyList1();
};
const handleCurrentChange2 = (val) => {
  state.currentPage2 = val;
  getUserOrderProxyList1();
};

const handleSizeChange1 = (val) => {
  state.pageSize1 = val;
  state.currentPage1 = 1;
  getCurrentOrderList();
};
const handleCurrentChange1 = (val) => {
  state.currentPage1 = val;
  getCurrentOrderList();
};

const getUserOrderProxyList2 = (uid) => {
  $api.currency
    .getUserOrderProxyList({
      uid: uid,
      stype : 2,
      size: state.pageSize3,
      page: state.currentPage3,
    })
    .then((res) => {
      state.total3 = res.count
      state.tb3 = res.data;
    });
}

const getUserOrderProxyList1 = (uid) => {
  $api.currency
    .getUserOrderProxyList({
      uid: uid,
      stype : 1,
      size: state.pageSize2,
      page: state.currentPage2,
    })
    .then((res) => {
      state.total2 = res.count
      state.tb2 = res.data;
    });
}

const getUserOrderList = (uid) => {
  $api.currency
    .getUserOrderList({
      uid: uid,
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.total1 = res.count
      state.tb1 = res.data;
    });
}

const getPlayerInfo = (uid) => {
  $api.player
    .playerInfoQry({
      uid: uid,
    })
    .then((res) => {
      state.userinfo = res.data;
    });
}

watch(
  () => props.info,
  (val) => {
    // let { name, access_level, nick, id } = val;
    // access_level = levelList.findIndex((item) => item.label == access_level);
    // console.log("access_level", access_level);
    // form.username = name;
    // form.nick = nick;
    // form.access_level = `${access_level}`;
    // form.user_id = id;
    console.log("editInfo", val);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="scss" scoped></style>

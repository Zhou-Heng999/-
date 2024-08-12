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
        {{ state.userinfo.account }}
        <el-button type="primary" round @click="addBlack">加入黑名单</el-button>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">上级:</div></template>
        {{ state.userinfo.parent_user_id }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">手机号:</div></template>
        {{ state.userinfo.phone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">顶级:</div></template>
        {{ state.userinfo.root_user_id }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">密码:</div></template>
        ******<el-button type="primary" round @click="resetPasswd"
          >重置密码</el-button
        >默认密码123456
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">注册时间:</div></template>
        {{ state.userinfo.create_date }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">用户状态:</div></template>
        <el-tag
          v-if="state.userinfo.state == 1"
          effect="dark"
          color="green"
          round
          type="success"
          >正常</el-tag
        >
        <el-tag v-else effect="dark" color="red" round type="danger"
          >冻结</el-tag
        >
        <el-button type="primary" round @click="editUserStatus"
          >冻结/解冻账号</el-button
        >
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">资金状态:</div></template>
        <el-tag
          v-if="state.userinfo.account_state == 0"
          effect="dark"
          color="green"
          round
          type="success"
          >正常</el-tag
        >
        <el-tag v-else effect="dark" color="red" round type="danger"
          >冻结</el-tag
        >
        <el-button type="primary" round @click="editAccountStatus"
          >冻结/解冻资金</el-button
        >
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">级别:</div></template>
        Lv.{{ state.userinfo.lv }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label
          ><div class="cell-item">
            开户状态:{{ form.open_status }}
          </div></template
        >
        <el-tag
          v-if="form.open_status == 0 || !form.open_status"
          effect="plain"
          color="red"
          round
          type="success"
          >未开户</el-tag
        >
        <el-tag v-if="form.open_status == 1" effect="plain" color="" type=""
          >待审核</el-tag
        >
        <el-tag v-if="form.open_status == 2" effect="plain" color="" type=""
          >已审核</el-tag
        >
        <el-button
          style="margin-left: 20px"
          @click="isopen_status = true"
          type="primary"
          v-if="form.open_status == 2"
        >查看开户信息
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label><div class="cell-item">杠杆上限:</div></template>
        <div v-if="state.userinfo.leverage > 1">1</div>
        <el-input-number
          :disabled="isLeverage"
          v-model="leverageNum"
          :min="1"
          @change="leverageChange"
        />
        <el-button
          style="margin-left: 20px"
          @click="leverageClick"
          type="primary"
        >
          {{ isLeverage ? "修改" : "保存" }}</el-button
        >
      </el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <el-descriptions
      class="margin-top"
      title="详细信息"
      :column="5"
      :size="size"
      border
    >
      <el-descriptions-item>
        <template #label><div class="cell-item">账户资产(HKD):</div></template>
        {{ state.userinfo.CNY }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">持仓市值(HKD):</div></template>
        {{ state.userinfo.USD }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">冻结金额(HKD):</div></template>
        {{ state.userinfo.HKD }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">融资负债(HKD):</div></template>
        {{ state.userinfo.RZ_CNY }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label
          ><div class="cell-item">融资可保证金(HKD):</div></template
        >
        {{ state.userinfo.RZ_USD }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">账户资产(USD):</div></template>
        {{ state.userinfo.CNY }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">持仓市值(USD):</div></template>
        {{ state.userinfo.USD }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">冻结金额(USD):</div></template>
        {{ state.userinfo.HKD }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">融资负债(USD):</div></template>
        {{ state.userinfo.RZ_CNY }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label
          ><div class="cell-item">融资可保证金(USD):</div></template
        >
        {{ state.userinfo.RZ_USD }}
      </el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <el-tabs type="border-card">
      <el-tab-pane label="当前订单">
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
          <el-table-column prop="create_date" label="订单时间">
          </el-table-column>
          <el-table-column prop="name" label="币种名称"> </el-table-column>
          <el-table-column prop="deposit" label="保证金"> </el-table-column>
          <!-- <el-table-column prop="deadtime" label="期限"> </el-table-column> -->
          <el-table-column prop="commission" label="佣金"> </el-table-column>
          <el-table-column prop="order_status" label="状态">
            <template #default="scope">
              <el-tag
                v-if="scope.row.order_status == 1"
                effect="dark"
                color="green"
                round
                type="success"
                >收益中</el-tag
              >
              <el-tag v-else effect="dark" color="blue" round type="danger"
                >已完成</el-tag
              >
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

      <el-tab-pane label="历史订单">
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
          <el-table-column prop="id" label="id"> </el-table-column>
          <el-table-column prop="create_date" label="订单时间">
          </el-table-column>
          <el-table-column prop="name" label="币种名称"> </el-table-column>
          <el-table-column prop="deposit" label="保证金"> </el-table-column>
          <!-- <el-table-column prop="deadtime" label="期限"> </el-table-column> -->
          <el-table-column prop="commission" label="佣金"> </el-table-column>
          <el-table-column prop="order_status" label="状态">
            <template #default="scope">
              <el-tag
                v-if="scope.row.order_status == 1"
                effect="dark"
                color="green"
                round
                type="success"
                >收益中</el-tag
              >
              <el-tag v-else effect="dark" color="blue" round type="danger"
                >已完成</el-tag
              >
            </template>
          </el-table-column>
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

      <el-tab-pane label="一级代理">
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
          <el-table-column prop="create_date" label="注册时间">
          </el-table-column>
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

      <!-- <el-tab-pane label="一级返佣">
        <el-table
          ref="filterTableRef5"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb5"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column prop="account" label="账号"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="proxy_commission1" label="佣金">
          </el-table-column>
          <el-table-column prop="create_date" label="注册时间">
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="state.currentPage5"
          v-model:page-size="state.pageSize5"
          :page-sizes="[20, 100, 200, 300, 400]"
          :small="small"
          :disabled="disabled"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total5"
          background
          @size-change="handleSizeChange5"
          @current-change="handleCurrentChange5"
        />
      </el-tab-pane> -->

      <el-tab-pane label="充值记录">
        <el-table
          ref="filterTableRef7"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb7"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="id" label="id"> </el-table-column>
          <el-table-column prop="create_date" label="充值时间">
          </el-table-column>
          <el-table-column prop="money" label="充值金额"> </el-table-column>
          <el-table-column prop="pay_type" label="充值方式">
            <template #default="scope">
              <el-tag
                v-if="scope.row.pay_type == 1"
                color="green"
                round
                type="success"
                >线上充值</el-tag
              >
              <el-tag v-else color="blue" round type="success">线下充值</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="trans_status" label="状态">
            <template #default="scope">
              <el-tag
                v-if="scope.row.trans_status == 1"
                color="green"
                type="success"
                >待确认</el-tag
              >
              <el-tag
                v-else-if="scope.row.trans_status == 2"
                color="blue"
                type="success"
                >成功</el-tag
              >
              <el-tag v-else color="red" type="success">失败</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="state.currentPage7"
          v-model:page-size="state.pageSize7"
          :page-sizes="[20, 100, 200, 300, 400]"
          :small="small"
          :disabled="disabled"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total7"
          background
          @size-change="handleSizeChange7"
          @current-change="handleCurrentChange7"
        />
      </el-tab-pane>

      <el-tab-pane label="提现记录">
        <el-table
          ref="filterTableRef8"
          stripe
          class="table-list"
          row-key="date"
          :data="state.tb8"
          style="width: 100%"
          v-loading="tableLoading"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="id" label="id"> </el-table-column>
          <el-table-column prop="create_date" label="提现时间">
          </el-table-column>
          <el-table-column prop="money" label="提现金额"> </el-table-column>
          <el-table-column prop="bank_card_no" label="银行卡号">
          </el-table-column>
          <el-table-column prop="bank_type" label="银行名称"> </el-table-column>
          <el-table-column prop="pay_type" label="提现方式">
            <template #default="scope">
              <el-tag
                v-if="scope.row.pay_type == 1"
                color="green"
                round
                type="success"
                >线上提现</el-tag
              >
              <el-tag v-else color="blue" round type="success">线下提现</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="trans_status" label="状态">
            <template #default="scope">
              <el-tag
                v-if="scope.row.trans_status == 1"
                color="green"
                round
                type="success"
                >待确认</el-tag
              >
              <el-tag
                v-else-if="scope.row.trans_status == 2"
                color="blue"
                round
                type="success"
                >成功</el-tag
              >
              <el-tag v-else color="red" round type="success">失败</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="state.currentPage8"
          v-model:page-size="state.pageSize8"
          :page-sizes="[20, 100, 200, 300, 400]"
          :small="small"
          :disabled="disabled"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total8"
          background
          @size-change="handleSizeChange8"
          @current-change="handleCurrentChange8"
        />
      </el-tab-pane>
    </el-tabs>
    <openAccount
    v-if="isopen_status"
    :addVisible="isopen_status"
    @closeModal="closeShow"
    :info="info"
  />
  </el-dialog>
</template>

<script setup>
import { onMounted } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import openAccount from "./openAccount.vue"
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: {},
  },
});
const addVisible = ref(true);
const editLoading = ref(false);

const leverageNum = ref(1);
const isLeverage = ref(false);
const isopen_status = ref(false);

const formRef = ref();
const loading = ref(false);
const form = reactive({
  uid: "",
});

const state = reactive({
  userinfo: {},

  tb1: [],
  currentPage1: 1,
  pageSize1: 20,
  total1: 0,

  tb2: [],
  currentPage2: 1,
  pageSize2: 20,
  total2: 0,

  tb3: [],
  currentPage3: 1,
  pageSize3: 20,
  total3: 0,

  tb4: [],
  currentPage4: 1,
  pageSize4: 20,
  total4: 0,

  tb4_1: [],
  total4_1: 0,

  tb5: [],
  currentPage5: 1,
  pageSize5: 20,
  total5: 0,

  tb6: [],
  currentPage6: 1,
  pageSize6: 20,
  total6: 0,

  tb6_1: [],
  total6_1: 0,

  tb7: [],
  currentPage7: 1,
  pageSize7: 20,
  total7: 0,

  tb8: [],
  currentPage8: 1,
  pageSize8: 20,
  total8: 0,
});

onMounted(() => {
  getPlayerInfo(form.uid);
  getSubordinateProxyList1(form.uid);
  getSubordinateProxyList2(form.uid);
  getSubordinateProxyList3(form.uid);
  // getWithdrawList(form.uid);
  // getRechargeList(form.uid);
});

const leverageChange = (val) => {
  leverageNum.value = val;
};

const closeShow = () => {
  isopen_status.value = false;
}

const leverageClick = () => {
  console.log("props.uid", form.uid);
  isLeverage.value = !isLeverage.value;
  console.log(state.userinfo.open_status);
  if (isLeverage.value) {
    $api.playerinfo
      .editLeverage({
        uid: form.uid,
        leverage: leverageNum.value,
      })
      .then((res) => {
        ElMessage("操作成功");
      });
  }
};

const handleSizeChange8 = (val) => {
  state.pageSize8 = val;
  state.currentPage8 = 1;
  getWithdrawList();
};
const handleCurrentChange8 = (val) => {
  state.currentPage8 = val;
  getWithdrawList();
};

const handleSizeChange7 = (val) => {
  state.pageSize7 = val;
  state.currentPage7 = 1;
  getRechargeList();
};
const handleCurrentChange7 = (val) => {
  state.currentPage7 = val;
  getRechargeList();
};

const handleSizeChange6 = (val) => {
  state.pageSize6 = val;
  state.currentPage6 = 1;
  getProxy2List();
};
const handleCurrentChange6 = (val) => {
  state.currentPage6 = val;
  getProxy2List();
};

const handleSizeChange6_1 = (val) => {
  state.pageSize6_1 = val;
  state.currentPage6_1 = 1;
  getProxy3List();
};
const handleCurrentChange6_1 = (val) => {
  state.currentPage6_1 = val;
  getProxy3List();
};

const handleSizeChange5 = (val) => {
  state.pageSize5 = val;
  state.currentPage5 = 1;
  getProxy1List();
};
const handleCurrentChange5 = (val) => {
  state.currentPage5 = val;
  getProxy1List();
};

const handleSizeChange4 = (val) => {
  state.pageSize4 = val;
  state.currentPage4 = 1;
  getSubordinateProxyList2();
};
const handleCurrentChange4 = (val) => {
  state.currentPage4 = val;
  getSubordinateProxyList2();
};
const handleCurrentChange4_1 = (val) => {
  state.currentPage4_1 = val;
  getSubordinateProxyList3();
};

const handleSizeChange3 = (val) => {
  state.pageSize3 = val;
  state.currentPage3 = 1;
  getSubordinateProxyList1();
};
const handleCurrentChange3 = (val) => {
  state.currentPage3 = val;
  getSubordinateProxyList1();
};

const handleSizeChange2 = (val) => {
  state.pageSize2 = val;
  state.currentPage2 = 1;
  getHistoryOrderList();
};
const handleCurrentChange2 = (val) => {
  state.currentPage2 = val;
  getHistoryOrderList();
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

const getWithdrawList = (uid) => {
  $api.player
    .withdrawList({
      uid: uid,
      size: state.pageSize8,
      page: state.currentPage8,
    })
    .then((res) => {
      state.total8 = res.count;
      state.tb8 = res.data;
    });
};

const getRechargeList = (uid) => {
  $api.player
    .rechargeList({
      uid: uid,
      size: state.pageSize7,
      page: state.currentPage7,
    })
    .then((res) => {
      state.total7 = res.count;
      state.tb7 = res.data;
    });
};

const getProxy2List = (uid) => {
  $api.proxy
    .proxy2List({
      uid: uid,
      size: state.pageSize6,
      page: state.currentPage6,
    })
    .then((res) => {
      state.total6 = res.count;
      state.tb6 = res.data;
    });
};

const getProxy3List = (uid) => {
  $api.proxy
    .proxy3List({
      uid: uid,
      size: state.pageSize6,
      page: state.currentPage6,
    })
    .then((res) => {
      state.total6_1 = res.count;
      state.tb6_1 = res.data;
    });
};

const getProxy1List = (uid) => {
  $api.proxy
    .proxy1List({
      uid: uid,
      size: state.pageSize5,
      page: state.currentPage5,
    })
    .then((res) => {
      state.total5 = res.count;
      state.tb5 = res.data;
    });
};

const getHistoryOrderList = (uid) => {
  $api.currency
    .historyOrderList({
      uid: uid,
      size: state.pageSize2,
      page: state.currentPage2,
    })
    .then((res) => {
      state.total2 = res.count;
      state.tb2 = res.data;
    });
};

const getSubordinateProxyList1 = (uid) => {
  $api.proxy
    .getSubordinateProxyList({
      uid: uid,
      stype: 1,
      size: state.pageSize3,
      page: state.currentPage3,
    })
    .then((res) => {
      state.total3 = res.count;
      state.tb3 = res.data;
    });
};

const getSubordinateProxyList2 = (uid) => {
  $api.proxy
    .getSubordinateProxyList({
      uid: uid,
      stype: 2,
      size: state.pageSize4,
      page: state.currentPage4,
    })
    .then((res) => {
      state.total4 = res.count;
      state.tb4 = res.data;
    });
};
const getSubordinateProxyList3 = (uid) => {
  $api.proxy
    .getSubordinateProxyList({
      uid: uid,
      stype: 3,
      size: state.pageSize4_1,
      page: state.currentPage4_1,
    })
    .then((res) => {
      state.total4_1 = res.count;
      state.tb4_1 = res.data;
    });
};

const getCurrentOrderList = (uid) => {
  $api.currency
    .currentOrderList({
      uid: uid,
      size: state.pageSize1,
      page: state.currentPage1,
    })
    .then((res) => {
      state.total1 = res.count;
      state.tb1 = res.data;
    });
};

const getPlayerInfo = (uid) => {
  $api.player
    .playerInfoQry({
      uid: uid,
    })
    .then((res) => {
      state.userinfo = res.data;
    });
};

const resetPasswd = () => {
  $api.player
    .resetPasswd({
      uid: form.uid,
    })
    .then((res) => {
      ElMessage("操作成功");
    });
};

const addBlack = () => {
  $api.player
    .addBlack({
      uid: form.uid,
    })
    .then((res) => {
      ElMessage("操作成功");
    });
};

const editUserStatus = () => {
  let ns = state.userinfo.state == 1 ? 0 : 1;
  $api.player
    .editUserStatus({
      uid: form.uid,
      state: ns,
    })
    .then((res) => {
      state.userinfo.state = ns;
      ElMessage("操作成功");
    });
};

const editAccountStatus = () => {
  let ns = state.userinfo.account_state == 1 ? 0 : 1;
  $api.player
    .editAccountStatus({
      uid: form.uid,
      state: ns,
    })
    .then((res) => {
      state.userinfo.account_state = ns;
      ElMessage("操作成功");
    });
};

watch(
  () => props.info,
  (val) => {
    console.log("editInfo", val);
    // let { name, access_level, nick, id } = val;
    // access_level = levelList.findIndex((item) => item.label == access_level);
    // console.log("access_level", access_level);
    // form.username = name;
    // form.nick = nick;
    // form.access_level = `${access_level}`;
    form.uid = val.id;
    form.open_status = val.open_status;
    leverageNum.value = val.leverage;
    console.log("state.form.open_status", form.open_status);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="scss" scoped></style>

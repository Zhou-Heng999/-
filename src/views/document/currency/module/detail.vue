<template>
  <el-dialog v-model="props.addVisible" top="20px" @close="emit('closeModal')">
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
        <template #label
          ><div class="cell-item">密码(默认123456):</div></template
        >

        <el-space>
          ******<el-button
            type="primary"
            size="small"
            round
            @click="resetPasswd"
            >重置密码</el-button
          >
        </el-space>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">注册时间:</div></template>
        {{ state.userinfo.reg_date }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">注册IP:</div></template>
        {{ state.userinfo.reg_ip }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">用户状态:</div></template>
        <el-space>
          <el-tag v-if="state.userinfo.state == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">冻结</el-tag>
          <el-button
            v-if="state.userinfo.state == 1"
            size="small"
            type="warning"
            round
            @click="editUserStatus"
            >冻结账号</el-button
          >
          <el-button
            v-else
            type="success"
            size="small"
            round
            @click="editUserStatus"
            >解冻账号</el-button
          >
        </el-space>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">VIP:</div></template>
        VIP.{{ state.userinfo.vip_lv }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">邀请人数:</div></template>
        {{ state.userinfo.invitation }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">玩家层级:</div></template>

        <el-space>
          <el-select v-model="form.lv">
            <el-option label="自动" value="0"></el-option>
            <el-option
              v-for="item in state.userlv_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button type="primary" size="small" round @click="changeLv"
            >修改</el-button
          >
        </el-space>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">代理等级:</div></template>
        {{ state.userinfo.proxy_lv }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">有效邀请人数:</div></template>
        {{ state.userinfo.child_num }}
      </el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <el-descriptions
      class="margin-top"
      title="详细信息"
      :column="2"
      :size="size"
      border
    >
      <el-descriptions-item>
        <template #label><div class="cell-item">金币:</div></template>
        <el-space>
          {{ state.userinfo.coin }}
          <el-button type="danger" size="small" round @click="addCoin"
            >增加</el-button
          >
          <el-button type="primary" size="small" round @click="reduceCoin"
            >减少</el-button
          >
        </el-space>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">充值金额:</div></template>
        {{ state.userinfo.recharge }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label><div class="cell-item">流水:</div></template>
        {{ state.userinfo.liushui }}
      </el-descriptions-item>
    </el-descriptions>

    <el-divider />
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
      <el-table-column prop="create_date" label="充值时间"> </el-table-column>
      <el-table-column prop="pay_amount" label="充值金额"> </el-table-column>
      <el-table-column prop="coin_amount" label="到账金币"> </el-table-column>
      <el-table-column prop="type" label="充值方式">
        <template #default="scope">
          <el-tag v-if="scope.row.type == 999" round type="danger"
            >GM加款</el-tag
          >
          <el-tag v-else-if="scope.row.type == 1" type="success"
            >微信支付</el-tag
          >
          <el-tag v-else-if="scope.row.type == 2" type="primary"
            >支付宝支付</el-tag
          >
          <el-tag v-else-if="scope.row.type == 3" type="warning"
            >银行卡支付</el-tag
          >
          <el-tag v-else-if="scope.row.type == 4" type="info">TRC支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.state == 0" type="info">待确认</el-tag>
          <el-tag v-else-if="scope.row.state == 1" type="success"
            >已回调</el-tag
          >
          <el-tag v-else-if="scope.row.state == 2" type="success"
            >审核成功</el-tag
          >
          <el-tag v-else-if="scope.row.state == 3" type="success"
            >审核成功</el-tag
          >
          <el-tag v-else-if="scope.row.state == 4" type="success"
            >已补单</el-tag
          >
          <el-tag v-else type="warning">失败</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { onMounted } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { ElMessage } from "element-plus";
import { getCurrentInstance, watch } from "@vue/runtime-core";
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

const formRef = ref();
const loading = ref(false);
const form = reactive({
  uid: "",
});

const state = reactive({
  userinfo: {},
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
  getPlayerInfo(props.info.uid);
  getRechargeList(props.info.uid);
  getUserLVList();
});

const handleSizeChange7 = (val) => {
  state.pageSize7 = val;
  state.currentPage7 = 1;
  getRechargeList(props.info.uid);
};
const handleCurrentChange7 = (val) => {
  state.currentPage7 = val;
  getRechargeList(props.info.uid);
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

const getPlayerInfo = (uid) => {
  console.log("uid", uid);
  $api.player
    .playerInfoQry({
      uid: uid,
    })
    .then((res) => {
      state.userinfo = res.data;
      form.lv = res.data.lv;
    });
};

const getUserLVList = () => {
  $api.userlv.list().then((res) => {
    state.userlv_list = res.data;
    console.log("state.userlv_list", state.userlv_list);
  });
};

const reduceCoin = () => {
  ElMessageBox.prompt("请输入减少金币金额", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      $api.player
        .reduceCoin({
          uid: props.info.uid,
          coin: value,
        })
        .then((res) => {
          getPlayerInfo(props.info.uid);
          getRechargeList(props.info.uid);
          ElMessage("操作成功");
        });
    })
    .catch((e) => {
      ElMessage({
        type: "info",
        message: "取消输入" + e,
      });
    });
};

const addCoin = () => {
  console.log();
  ElMessageBox.prompt("请输入增加金币金额", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      $api.player
        .addCoin({
          uid: props.info.uid,
          coin: value,
          account: props.info.account,
        })
        .then((res) => {
          getPlayerInfo(props.info.uid);
          getRechargeList(props.info.uid);
          ElMessage("操作成功");
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消输入",
      });
    });
};

const resetPasswd = () => {
  $api.player
    .resetPasswd({
      uid: props.info.uid,
    })
    .then((res) => {
      ElMessage("操作成功");
    });
};

const editUserStatus = () => {
  let ns = state.userinfo.state == 1 ? 0 : 1;
  $api.player
    .editUserStatus({
      uid: props.info.uid,
      state: ns,
    })
    .then((res) => {
      state.userinfo.state = ns;
      ElMessage("操作成功");
    });
};

const changeLv = () => {
  $api.player
    .changeLv({
      uid: props.info.uid,
      lv: form.lv,
    })
    .then((res) => {
      ElMessage("操作成功");
    });
};

watch(
  () => props.info,
  (val) => {
    console.log("editInfo", val);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="scss" scoped></style>

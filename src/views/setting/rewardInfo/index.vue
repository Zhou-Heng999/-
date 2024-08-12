<template>
  <div class="table-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="400px"
      style="width: 800px"
    >
      <div v-for="item in formList">
        <el-divider
          ><span style="color: #409eff">{{ item.title }}</span></el-divider
        >
        <el-form-item
          v-for="its in item.formItems"
          :label="its.label"
          :prop="its.prop"
        >
          <el-input
            v-model="form[its.prop]"
            :type="its.subtype"
            :rows="4"
            v-if="its.type === 'input'"
          ></el-input>
          <el-date-picker
            v-model="form[its.prop]"
            v-else-if="its.type === 'datetimerange'"
            format="YYYY/MM/DD HH:mm:ss"
            type="datetimerange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="shortcuts"
            value-format="x"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
  <el-row class="flex-center">
    <el-button type="primary" :loading="addLoading" @click="submitForm()">
      <i class="fa fa-plus"> </i> 保存
    </el-button>
  </el-row>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const addLoading = ref(false);
const formRef = ref();
const form = reactive({
  day1Money: "",
  day5Money: "",
  day10Money: "",
  day30Money: "",
  signDays: "",
  signMoney: "",
  validPercent: "",
  signRules: "",
  registerMoney: "",
  invitationMoney: "",
  registerDes: "",
  dayInviteNum: "",
  dayInviteMoney: "",
  weekInviteNum: "",
  weekInviteMoney: "",
  monthInviteNum: "",
  monthInviteMoney: "",
});
const formList = reactive([
  // {
  //   title:'签到设置',
  //   formItems:[
  //     {label:'每日签到金额(USDT)：', prop:'day1Money', type:'input', subtype:"text"},
  //     {label:'连续签到5天额外奖励(USDT)：', prop:'day5Money', type:'input', subtype:"text"},
  //     {label:'连续签到10天额外奖励(USDT)：', prop:'day10Money', type:'input', subtype:"text"},
  //     {label:'连续签到28天额外奖励(USDT)：', prop:'day30Money', type:'input', subtype:"text"},
  //     {label:'免费使用矿机连续签到天数：', prop:'signDays', type:'input', subtype:"text"},
  //     {label:'签到可提现/交易需累积达到的金额(USDT)：', prop:'signMoney', type:'input', subtype:"text"},
  //     {label:'签到转化金额比率(%)：', prop:'validPercent', type:'input', subtype:"text"},
  //     {label:'签到规则：', prop:'signRules', type:'input', subtype:"textarea"},
  //   ]
  // },
  {
    title: "注册邀请设置",
    formItems: [
      {
        label: "注册奖励(USDT)：",
        prop: "registerMoney",
        type: "input",
        subtype: "text",
      },
      {
        label: "邀请好友充值并操作奖励(USDT)：",
        prop: "invitationMoney",
        type: "input",
        subtype: "text",
      },
      {
        label: "注册需知：",
        prop: "registerDes",
        type: "input",
        subtype: "textarea",
      },
    ],
  },
  {
    title: "体验金设置",
    formItems: [
      {
        label: "体验金",
        prop: "init_coin",
        type: "input",
        subtype: "text",
      },
      {
        label: "体验金回收时间(天)：",
        prop: "coin_end_time",
        type: "input",
      },
    ],
  },
  {
    title: "邀请任务设置",
    formItems: [
      { label: "开始结束时间：", prop: "dayTime", type: "datetimerange" },
      {
        label: "当日邀请注册，并参与交易极速合约的人数达到：",
        prop: "dayInviteNum",
        type: "input",
        subtype: "text",
      },
      {
        label: "当日邀请奖励(USDT)：",
        prop: "dayInviteMoney",
        type: "input",
        subtype: "text",
      },
      { label: "开始结束时间：", prop: "weekTime", type: "datetimerange" },
      {
        label: "当周邀请注册，并参与交易极速合约的人数达到：",
        prop: "weekInviteNum",
        type: "input",
        subtype: "text",
      },
      {
        label: "当周邀请奖励(USDT)：",
        prop: "weekInviteMoney",
        type: "input",
        subtype: "text",
      },
      { label: "开始结束时间：", prop: "monthTime", type: "datetimerange" },
      {
        label: "当月邀请注册，并参与交易极速合约的人数达到：",
        prop: "monthInviteNum",
        type: "input",
        subtype: "text",
      },
      {
        label: "当月邀请奖励(USDT)：",
        prop: "monthInviteMoney",
        type: "input",
        subtype: "text",
      },
    ],
  },
  // {
  //   title:'星级达人等级设置',
  //   formItems:[
  //     {label:'一星达人邀请人数：', prop:'s1InviteNum', type:'input', subtype:"text"},
  //     {label:'一星达人每日奖励(USDT)：', prop:'s1InviteMoney', type:'input', subtype:"text"},
  //     {label:'二星达人邀请人数：', prop:'s2InviteNum', type:'input', subtype:"text"},
  //     {label:'二星达人每日奖励(USDT)：', prop:'s2InviteMoney', type:'input', subtype:"text"},
  //     {label:'三星达人邀请人数：', prop:'s3InviteNum', type:'input', subtype:"text"},
  //     {label:'三星达人每日奖励(USDT)：', prop:'s3InviteMoney', type:'input', subtype:"text"},
  //     {label:'四星达人邀请人数：', prop:'s4InviteNum', type:'input', subtype:"text"},
  //     {label:'四星达人每日奖励(USDT)：', prop:'s4InviteMoney', type:'input', subtype:"text"},
  //     {label:'Lv.0邀请人数：', prop:'lv0InviteNum', type:'input', subtype:"text"},
  //     {label:'Lv.0每日奖励(USDT)：', prop:'lv0InviteMoney', type:'input', subtype:"text"},
  //   ]
  // },
]);
const rules = {
  day1Money: [{ required: true, message: "请输入", trigger: "blur" }],
  day5Money: [{ required: true, message: "请输入", trigger: "blur" }],
  day10Money: [{ required: true, message: "请输入", trigger: "blur" }],
  day30Money: [{ required: true, message: "请输入", trigger: "blur" }],
  signDays: [{ required: true, message: "请输入", trigger: "blur" }],
  signMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  validPercent: [{ required: true, message: "请输入", trigger: "blur" }],
  signRules: [{ required: true, message: "请输入", trigger: "blur" }],
  registerMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  invitationMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  dayInviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  dayInviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  weekInviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  weekInviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  monthInviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  monthInviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  s1InviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  s1InviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  s2InviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  s2InviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  s3InviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  s3InviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  s4InviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  s4InviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
  lv0InviteNum: [{ required: true, message: "请输入", trigger: "blur" }],
  lv0InviteMoney: [{ required: true, message: "请输入", trigger: "blur" }],
};

onMounted(() => {
  getRewardInfo();
});

// methods
const getRewardInfo = () => {
  $api.setting.getRewardInfo().then((res) => {
    console.log("getRewardInfo", res);
    form.day10Money = res.data.day10Money;
    form.day1Money = res.data.day1Money;
    form.day30Money = res.data.day30Money;
    form.day5Money = res.data.day5Money;
    form.signDays = res.data.signDays;
    form.signMoney = res.data.signMoney;
    form.signRules = res.data.signRules;
    form.validPercent = res.data.validPercent;
    form.registerMoney = res.data.registerMoney;
    form.invitationMoney = res.data.invitationMoney;
    form.registerDes = res.data.registerDes;
    form.dayInviteNum = res.data.dayInviteNum;
    form.dayInviteMoney = res.data.dayInviteMoney;
    form.weekInviteNum = res.data.weekInviteNum;
    form.weekInviteMoney = res.data.weekInviteMoney;
    form.monthInviteNum = res.data.monthInviteNum;
    form.monthInviteMoney = res.data.monthInviteMoney;
    form.dayTime = JSON.parse(res.data.dayTime);
    form.weekTime = JSON.parse(res.data.weekTime);
    form.monthTime = JSON.parse(res.data.monthTime);
    form.s1InviteNum = res.data.s1InviteNum;
    form.s1InviteMoney = res.data.s1InviteMoney;
    form.s2InviteNum = res.data.s2InviteNum;
    form.s2InviteMoney = res.data.s2InviteMoney;
    form.s3InviteNum = res.data.s3InviteNum;
    form.s3InviteMoney = res.data.s3InviteMoney;
    form.s4InviteNum = res.data.s4InviteNum;
    form.s4InviteMoney = res.data.s4InviteMoney;
    form.lv0InviteNum = res.data.lv0InviteNum;
    form.init_coin = res.data.init_coin;
    form.coin_end_time = res.data.coin_end_time / 86400;
  });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let { coin_end_time, ...params } = form;
      params.signRules = JSON.stringify(params.signRules.split("\n"));
      params.registerDes = JSON.stringify(params.registerDes.split("\n"));
      params.dayTime = JSON.stringify(params.dayTime);
      params.weekTime = JSON.stringify(params.weekTime);
      params.monthTime = JSON.stringify(params.monthTime);
      addLoading.value = true;
      $api.setting
        .setRewardInfo({
          ...params,
          coin_end_time: coin_end_time * 86400,
        })
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "保存成功",
            });
          }
        })
        .finally(() => {
          addLoading.value = false;
          getRewardInfo();
        });
    }
  });
};
</script>
<style lang="scss" scoped>
.table-container {
  display: flex;
  justify-content: center;
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

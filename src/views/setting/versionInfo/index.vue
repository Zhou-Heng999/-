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
  ios_url: "",
  android_url: "",
  buy_fee: "0",
  sell_fee: "0",
});

const formList = reactive([
  {
    title: "下载设置",
    formItems: [
      {
        label: "IOS下载地址:",
        prop: "ios_url",
        type: "input",
      },
      {
        label: "android下载地址:",
        prop: "android_url",
        type: "input",
      },
    ],
  },
  {
    title: "费率设置",
    formItems: [
      {
        label: "印花税(%):",
        prop: "stamp_duty",
        type: "input",
      },
      {
        label: "佣金(%):",
        prop: "fee",
        type: "input",
      },
      {
        label: "过户费(%):",
        prop: "transfer_fee",
        type: "input",
      },
      {
        label: "融资杠杆倍数:",
        prop: "leverage",
        type: "input",
      },
      {
        label: "融资手续费:",
        prop: "rz_fee",
        type: "input",
      },
      {
        label: "融资合约日利率:",
        prop: "daily_interest_rate",
        type: "input",
      },
    ],
  },
])

const rules = {
  buy_fee: [{ required: true, message: "请输入", trigger: "blur" }],
  sell_fee: [{ required: true, message: "请输入", trigger: "blur" }],
};

onMounted(() => {
  getSystem();
});

// methods
const getSystem = () => {
  $api.setting.getSystem().then((res) => {
    console.log("getSystem", res);
    form.ios_url = res.data.ios_url;
    form.android_url = res.data.android_url;
    form.stamp_duty = res.data.stamp_duty;
    form.fee = res.data.fee;
    form.transfer_fee = res.data.transfer_fee;
    form.leverage = res.data.leverage;
    form.rz_fee = res.data.rz_fee;
  });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("form", form);
      addLoading.value = true;
      $api.setting
        .setSystem(form)
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
          getSystem();
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

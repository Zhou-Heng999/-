<template>
  <div class="table-container">
    <el-card class="box-card" shadow="never">
      <template #header>
        <span>兑换比例设定</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="190px">
        <el-form-item label="1 USDT =" prop="rmbRate">
          <el-input v-model="form.rmbRate" style="width: 100px"></el-input>
          <span style="margin-left: 10px">RMB</span>
        </el-form-item>
        <el-form-item label="1 USD =" prop="usdRate">
          <el-input v-model="form.usdRate" style="width: 100px"></el-input>
          <span style="margin-left: 10px">USDT</span>
        </el-form-item>
        <el-form-item label="1 TRX =" prop="usdtRate">
          <el-input v-model="form.usdtRate" style="width: 100px"></el-input>
          <span style="margin-left: 10px">USDT</span>
        </el-form-item>
        <el-row class="flex-center" style="margin-top: 75px">
          <el-button type="primary" :loading="addLoading" @click="submitForm()">
            <i class="fa fa-plus"> </i> 保存
          </el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const addLoading = ref(false);
const formRef = ref();
const form = reactive({
  rmbRate: "",
  usdtRate: "",
  usdRate: "",
});
const rules = {};

onMounted(() => {
  getExchangeInfo();
});

// methods
const getExchangeInfo = () => {
  $api.setting.getExchangeInfo().then((res) => {
    console.log("getExchangeInfo", res);
    form.rmbRate = res.data.rmbRate;
    form.usdtRate = res.data.usdtRate;
  });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("form", form);
      addLoading.value = true;
      $api.setting
        .setExchangeInfo(form)
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
          getExchangeInfo();
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
.box-card {
  width: 500px;
}
</style>

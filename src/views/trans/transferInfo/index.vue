<template>
  <div class="table-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="200px" style="width: 500px">
      <el-form-item label="转入延迟到账时间(分钟)：" prop="minValue">
        <el-input v-model="form.minValue" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="最低划账金额(USDT)：" prop="minMoney">
        <el-input v-model="form.minMoney" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="手续费(%)：" prop="feePercent">
        <el-input v-model="form.feePercent" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="转账需知：" prop="rules">
        <el-input v-model="form.rules" type="textarea" :rows="5"></el-input>
      </el-form-item>
      <el-row class="flex-center" style="margin-top: 50px;">
        <el-button type="primary" :loading="addLoading" @click="submitForm()">
          <i class="fa fa-plus"> </i> 保存
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
  import {
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    toRefs,
  } from "vue";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  const addLoading = ref(false);
  const formRef = ref();
  const form = reactive({
    minValue: "",
    minMoney: "",
    feePercent: "",
    rules: "",
  });
  const rules = {
    minValue: [{ required: true, message: "请输入", trigger: "blur" }],
    minMoney: [{ required: true, message: "请输入", trigger: "blur" }],
    feePercent: [{ required: true, message: "请输入", trigger: "blur" }],
    rules: [{ required: true, message: "请输入", trigger: "blur" }],
  };

  onMounted(() => {
    getTransferInfo()
  });

  // methods
  const getTransferInfo = () => {
    $api.trans
            .get_transfer_info()
            .then((res) => {
              console.log("getTransferInfo", res);
              form.minValue = res.data.minValue
              form.minMoney = res.data.minMoney
              form.feePercent = res.data.feePercent
              form.rules = res.data.rules
            });
  };

  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        console.log('form', form)
        let _d = {
          minValue: form.minValue,
          minMoney: form.minMoney,
          feePercent: form.feePercent,
          rules: JSON.stringify(form.rules.split('\n')),
        }
        addLoading.value = true;
        $api.trans
                .edit_transfer_info(_d)
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
                  getTransferInfo();
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

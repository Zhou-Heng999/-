<template>
  <div class="table-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" style="width: 600px">
      <el-form-item label="弹窗状态" prop="isOnline">
        <el-switch v-model="form.isOnline"/>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="4"/>
      </el-form-item>
      <el-row class="flex-center" style="margin-top: 75px;">
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
  isOnline: false,
  content: "",
});
const rules = {
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
};

onMounted(() => {
  getPopup()
});

// methods
const getPopup = () => {
  $api.pub
    .getPopup()
    .then((res) => {
      console.log("getPopup", res);
      form.isOnline = res.data.isOnline
      form.content = res.data.content
    });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log('form', form)
      addLoading.value = true;
      $api.pub
              .savePop(form)
              .then((res) => {
                if (res.result) {
                  ElMessage({
                    type: "success",
                    showClose: true,
                    message: "保存成功",
                  });
                  getPopup();
                }
              })
              .finally(() => {
                addLoading.value = false;
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

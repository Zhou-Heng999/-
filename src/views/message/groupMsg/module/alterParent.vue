<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="修改上级"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >

        <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="请输入账号"/>
        </el-form-item>

        <el-form-item label="上级账号" prop="parent">
        <el-input v-model="form.parent" placeholder="请输入上级账号"/>
        </el-form-item>

        <el-row class="btn-container">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 修改
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import {onMounted} from "vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible : {},
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  parent: [{ required: true, message: "请输入账号", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  account : "",
  parent : "",
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.player
        .editUserProxy(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "操作成功",
            });
            emit("closeModal");
          }
        })
        .finally(() => {
          addLoading.value = false;
        });
    }
  });
};
</script>
<style lang="scss" scoped></style>

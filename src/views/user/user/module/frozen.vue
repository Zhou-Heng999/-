<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="冻结/解冻下级账户"
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

        <el-form-item label="状态">
          <el-select v-model="form.state">
            <el-option
              v-for="item in options"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label=""><font color="red">【冻结/解冻】是对该用户及其所有下级用户进行账户冻结/解冻，请谨慎操作！</font></el-form-item>

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
  addVisible : {}
});

const options = [
  {"id":0, "name":"冻结"},
  {"id":1, "name":"解冻"},
]

const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  account : "",
  state : "",
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  console.log("form", form)
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.player
        .updateUserChildStatus(form)
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

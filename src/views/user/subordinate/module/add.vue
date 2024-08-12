<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="新增下属"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >

      <el-form-item label="选择类型" prop="stype">
        <el-radio-group v-model="form.stype">
          <el-radio label="1" size="large">账号</el-radio>
          <el-radio label="2" size="large">手机号</el-radio>
        </el-radio-group>
      </el-form-item>

        <el-form-item label="账号/手机号" prop="account">
          <el-input
            v-model="form.account"
            placeholder="请输入用户账号/手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="团队名称" prop="nick">
          <el-input v-model="form.nick" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-row class="btn-container">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认添加
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  stype: [{ required: true, message: "请选择类型", trigger: "blur" }],
  account: [{ required: true, message: "请输入账户/手机号", trigger: "blur" }],
  nick: [{ required: true, message: "请输入团队名称", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  stype: "",
  nick: "",
  account: "",
});
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.proxy
        .addSubordinate(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "添加成功",
            });
            emit("updateList");
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

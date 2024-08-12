<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="添加账户"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="用户账号" prop="account">
          <el-input
            v-model="form.account"
            placeholder="请输入用户账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nick">
          <el-input v-model="form.nick" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="账户密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
            placeholder="请输入账户密码"
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
            <el-select v-model="form.role">
              <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
        </el-form-item>

        <el-form-item label="登录ip" prop="ip_whitelist">
          <el-input
            v-model="form.ip_whitelist"
            placeholder="请输入指定的ip地址,多个ip用逗号隔开"
          />
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
  roleData : [],
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  account: [{ required: true, message: "请输入用户账户", trigger: "blur" }],
  password: [{ required: true, message: "请输入账户密码", trigger: "blur" }],
  nick: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],

  role: [{ required: true, message: "请选择角色", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  account: "",
  nick: "",
  password: "",
  role: "",
  ip_whitelist: ''
});
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.users
        .userAdd(form)
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
<style lang="scss" scoped>.el-select {
  flex: 1;
}</style>

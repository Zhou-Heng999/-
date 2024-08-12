<template>
  <el-dialog
    v-model="props.dialogVisible"
    @close="close"
    width="25%"
    append-to-body
    title="修改密码"
  >
    <el-form
      ref="resetRef"
      :model="resetForm"
      status-icon
      :hide-required-asterisk="true"
      :rules="rules"
      label-width="100px"
      class="login-form"
    >
      <el-form-item label="原密码" prop="password">
        <el-input
          v-model="resetForm.password"
          type="password"
          autocomplete="off"
          placeholder="请输入原密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="resetForm.newPassword"
          type="password"
          autocomplete="off"
          placeholder="请输入新登录密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model="resetForm.checkPass"
          type="password"
          placeholder="请再次输入新登录密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <div class="btn-container">
          <el-button
            type="primary"
            style="width: 100%"
            @click="handleResetPwd()"
            >确认修改</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("toLogin");
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});

const resetRef = ref();

const resetForm = reactive({
  password: "",
  newPassword: "",
  checkPass: "",
});
const sendingCode = ref(false);
/**
 * @description 获取验证码
 */
const handleGetCaptcha = async () => {
  try {
    const { email } = resetForm;
    if (!email) {
      ElMessage({
        type: "warning",
        message: "请输入注册邮箱",
      });
      return false;
    }
    const data = {
      email,
    };
    const res = await Service.postForgetPwd(data);
    if (res.status === 0) {
      ElMessage({
        type: "success",
        message: res.message,
      });
      getCodeSucces();
      return true;
    }
    ElMessage({
      type: "warning",
      message: res.message,
    });
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
/**
 * @description 重置密码
 *
 */
const handleResetPwd = async () => {
  resetRef.value.validate(async (valid) => {
    if (valid) {
      try {
        $api.users
            .resetPassword(resetForm)
            .then((res) => {
                ElMessage({
                  type: "success",
                  message: res.msg,
                });
                emit("closeModal");
            })
            .catch((err) => {
              console.log(err);
              ElMessage({
                type: "warning",
                message: res.msg,
              });
            })

      } catch (err) {
        console.error(err);
      }
    }
    return false;
  });
};

// eslint-disable-next-line no-unused-vars
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== resetForm.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (resetForm.checkPass !== "") {
      resetRef.value.validateField("checkPass");
    }
    callback();
  }
};
const close = () => {
  emit("closeModal");
};
const rules = {
  password: [
    { validator: validatePass, trigger: "blur" },
    { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" },
  ],
  newPassword: [
    { validator: validatePass, trigger: "blur" },
    { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" },
  ],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 100%;
}

.login-form {
  width: 100%;
  margin: 0 auto;
}

.go-login {
  font-size: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .to-login {
    color: #9fa2a8;

    em {
      color: #2878ff;
    }
  }
}
</style>

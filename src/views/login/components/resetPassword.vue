<template>
  <el-dialog
      v-model="props.dialogVisible"
      @close="close"
      width="40%"
      append-to-body
      title="修改密码"
  >
    <el-form
        ref="resetRef"
        :model="resetForm"
        status-icon
        :hide-required-asterisk="true"
        :rules="rules"
        label-width="200px"
        class="login-form"
    >
      <el-form-item label="原密码" prop="old_password">
        <el-input
            v-model="resetForm.old_password"
            type="password"
            autocomplete="off"
            placeholder="请输入原密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password1">
        <el-input
            v-model="resetForm.new_password1"
            type="password"
            autocomplete="off"
            placeholder="请输入新登录密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="new_password2">
        <el-input
            v-model="resetForm.new_password2"
            type="password"
            placeholder="请再次输入新登录密码"
            autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="谷歌验证器绑定">
        <qrcode-vue
            v-if="props.codeImage"
            :value="props.codeImage"
            :size="200"
            level="H"
        />
      </el-form-item>

      <el-form-item label="google验证码" prop="code">
        <el-input
            v-model="resetForm.google_code"
            max="6"
            placeholder="动态验证码(六位数字)"
            class="code-view-input"
        >
          <template #append>
            <el-button> 验证 </el-button>
          </template>
        </el-input>
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
  import QrcodeVue from "qrcode.vue";
  import { getCurrentInstance } from "vue";
  const { $api } = getCurrentInstance().appContext.config.globalProperties;

  const emit = defineEmits("toLogin", "confirmBtn");
  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    codeImage: {
      type: String,
      default: "",
    },
    secretKey: {
      type: String,
      default: "",
    }
  });

  const resetRef = ref();
  const codeImage = ref(null);

  const resetForm = reactive({
    old_password: "",
    new_password1: "",
    new_password2: "",
    google_code: "",
    google_secret: ""
  });
  const sendingCode = ref(false);
  const handleResetPwd = async () => {
    resetRef.value.validate(async (valid) => {
      if (valid) {
        resetPas();
      }
      return false;
    });
  };
  const resetPas = () => {
    resetForm.google_secret = props.secretKey
    $api.users.changePassword(resetForm).then((res) => {
      console.log(res);
      emit("confirmBtn", resetForm.new_password1);
    }).catch(err=>{
      console.log(err);
    });
  };

  // eslint-disable-next-line no-unused-vars
  const validatePass2 = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("请再次输入密码"));
    } else if (value !== resetForm.new_password1) {
      callback(new Error("两次输入密码不一致!"));
    } else {
      callback();
    }
  };
  const validatePass = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("请输入密码"));
    } else {
      callback();
    }
  };
  const close = () => {
    emit("closeModal");
  };
  const rules = {
    old_password: [
      { validator: validatePass, trigger: "blur" },
      { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" },
    ],
    new_password1: [
      { validator: validatePass, trigger: "blur" },
      { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" },
    ],
    new_password2: [{ validator: validatePass2, trigger: "blur" }],
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

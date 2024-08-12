<template>
  <div class="form-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      status-icon
      :hide-required-asterisk="true"
      :rules="rules"
      label-width="100px"
      class="login-form"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="loginForm.username"
          autocomplete="off"
          placeholder="请输入登录账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item label="谷歌验证码" prop="code">
        <el-input
          v-model="loginForm.code"
          placeholder="新用户验证码输入可为任意数字"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <div class="btn-container">
          <el-button
            type="primary"
            :loading-icon="Eleme"
            :loading="loginLoading"
            style="width: 100%"
            @click="submitForm()"
            >登录</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <verification :dialogVisible="isVerificationShow"></verification>
    <resetPassword
      :codeImage="codeImage"
      :secretKey="secretKey"
      :dialogVisible="isShowReset"
      @closeModal="isShowReset = false"
      @confirmBtn="resetConfrim"
    ></resetPassword>
  </div>
</template>
<script setup>
import {
  reactive,
  onMounted,
  getCurrentInstance,
  ref,
  watch,
  computed,
} from "vue";
import { Eleme } from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import googleCode from "@/components/googleCode/index.vue";
import verification from "@/components/verification/index.vue";
import resetPassword from "./resetPassword.vue";
import mixins from "@/mixins/list";
let { getMenuList } = mixins();
const isShowReset = ref(false);
const emit = defineEmits("toResetPwd");
const router = useRouter();
const route = useRoute();
const loginFormRef = ref();
const isVerificationShow = ref(false);
const registerRef = ref();
const loginForm = reactive({
  username: "",
  password: "",
  code: "",
});
const codeImage = ref("");
const secretKey = ref("");
const loginLoading = ref(false);
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const routeList = computed(() => store.state.app.routeList);

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const rules = {
  password: [
    { validator: validatePass, trigger: "blur" },
    { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" },
  ],
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  code: [{ required: true, message: "请输入谷歌验证码", trigger: "blur" }],
};
onMounted(() => {});

// methods

/**
 * @description  用户登录接口
 *
 */
const resetConfrim = (val) => {
  console.log(val);
  isShowReset.value = false;
  loginForm.password = "";
  loginForm.code = "";

  submitForm();
};
const submitForm = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loginLoading.value = true;
      const { username } = loginForm;
      const res = await $api.login
        .loginIn({ ...loginForm })
        .catch((err) => {
          let errData = err.data;
          if (errData.hasOwnProperty('has_gs') && !errData.has_gs) {
            codeImage.value = errData.gs_data.qr_code_url;
            isShowReset.value = true;
            secretKey.value = errData.gs_data.secret;
          }
          localStorage.setItem("token", err.data.token)
          localStorage.setItem("channel", res.data.channel);
          // if (err.msg == "change_passwd") {
          //   codeImage.value = err.key;
          //   isShowReset.value = true;
          // }
        })
        .finally(() => {
          loginLoading.value = false;
        });
      if (res?.result) {
        const loading = ElLoading.service({
          lock: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        store.commit("app/changeUserinfo", { username });
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("channel", res.data.channel);
        getMenuList().then((res1) => {
          //清除保存的菜单栏
          loading.close();
          console.log(12345789,res1);
          if(res1){
          let newArr = routeList.value.filter((item) => item.path == "/home");
          store.commit("app/setRouteList", newArr);
          router.push({
            path: "/home",
          });
          getDic()
          }
        });

      }
    }
    return false;
  });
};
const getDic = () => {
  $api.dictionary
    .list({
      page: 1,
      size: 300,
    }).then(res => {
      // let list = res.data
      if(res&&res.result){
        let list = res.data.list;
        store.commit("app/setTypeList", list);
      }
    })
}
const handleForget = () => {
  // emit("toResetPwd");
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 100%;

  :deep(.el-input-group__append) {
    padding: 0px 7px;
  }

  :deep(.el-input-group__prepend) {
    padding: 0px 7px;
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

  .operation {
    font-size: 12px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .free-register {
      color: #2878ff;
    }

    .forget-password {
      color: #9fa2a8;
    }
  }
  .btn-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>

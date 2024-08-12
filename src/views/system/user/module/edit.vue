<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑账户"
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
            placeholder="请输入账户密码(空则不修改)"
          />
        </el-form-item>

        <el-form-item label="角色" prop="access_level">
          <el-select v-model="form.role_id" defaultSelect="info.role_id">
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
            :loading="editLoading"
            type="primary"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认修改
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: {},
  },
  roleData : [],
});
const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
  username: [{ required: true, message: "请输入用户账户", trigger: "blur" }],
  nick: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  code: [{ required: true, message: "请输入谷歌验证码", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  username: "",
  nick: "",
  password: "",
  role: "0",
  code: "",
  ip_whitelist: ''
});

watch(
  () => props.info,
  (val) => {
    let { id, account, role_id, nick, ip_whitelist} = val;
    form.account = account;
    form.nick = nick;
    form.role_id = role_id;
    form.user_id = id;
    form.ip_whitelist = ip_whitelist;
    console.log("editInfo", val);
  },
  {
    immediate: true,
    deep: true,
  }
);
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;

      $api.users
        .userUpdate(form)
        .then((res) => {
          console.log("form", res);
          if (res.result) {
            ElMessage({
              showClose: true,
              message: "编辑成功",
            });
            emit("updateList");
            emit("closeModal");
          }
        })
        .finally(() => {
          editLoading.value = false;
        });
      // 此处暂时省去异步接口处理
    }
  });
};
</script>
<style lang="scss" scoped>.el-select {
  flex: 1;
}</style>

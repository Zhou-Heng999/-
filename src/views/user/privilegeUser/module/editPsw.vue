<template>
    <el-dialog
      v-model="props.addVisible"
      width="632px"
      @close="emit('closeModal')"
      title="修改密码"
    >
      <div v-loading="loading" class="new">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="渠道" prop="channel">
             <!-- <el-select v-model="form.name">
              <el-option
                v-for="item in tagData"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              />
            </el-select> -->
            <el-input v-model="form.channel" placeholder="请输入渠道"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" type="text" placeholder="请输入账号" />
          </el-form-item>
          
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" type="text" placeholder="请输入新密码" />
          </el-form-item>
          <!-- <el-form-item label="应用" prop="appid">
            <el-select v-model="form.appid">
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
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
    tagData:[]
  });
  const addVisible = ref(true);
  const editLoading = ref(false);
  
  const rules = {
    channel: [{ required: true, message: "请输入渠道", trigger: "blur" }],
    account: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  };
  
  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    channel: "",
    account: "",
    password: "",
  });
  const appList = ref([]);
  
  watch(
    () => props.info,
    (val) => {
      let { account, channel } = val;
      form.account = account,
      form.channel = channel;
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
        $api.appUser
          .modify_password(form)
          .then((res) => {
            console.log("form", res);
            if (res.result) {
              ElMessage({
                showClose: true,
                message: "修改成功",
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
  <style lang="scss" scoped>
  .el-select {
    flex: 1;
  }
  </style>
  
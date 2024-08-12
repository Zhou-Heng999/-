<template>
    <el-dialog
      v-model="props.addVisible"
      width="632px"
      @close="emit('closeModal')"
      title="设置全局禁言"
    >
      <div v-loading="loading" class="new">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >

        <el-form-item label="禁言状态" prop="status">
            <div>{{ state.isMute==true? '全局禁言中': '未禁言'}}</div>
          </el-form-item>

        <el-form-item label="群聊禁言(秒)" prop="name">
            <el-input v-model="form.C2CmsgNospeakingTime" type="number" placeholder="请输入秒数" />
          </el-form-item>
  
          <el-form-item label="私聊禁言(秒)" prop="code">
            <el-input v-model="form.GroupmsgNospeakingTime" type="number" placeholder="请输入秒数" />
          </el-form-item>
  
          <el-row class="btn-container">
            <el-button
              size="small"
              :loading="editLoading"
              type="primary"
              @click="submitForm()"
            >
              <i class="fa fa-plus"> </i> 确认
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
  
  const state = reactive({
    account: '',
    isMute: false
  })
  
  const rules = {
    // name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    // code: [{ required: true, message: "请输入渠道代码", trigger: "blur" }],
    // appid: [{ required: true, message: "请选择应用", trigger: "blur" }],
  };
  
  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    C2CmsgNospeakingTime: 0,
    GroupmsgNospeakingTime: 0,
  });
  const appList = ref([]);
  
  const getAppList = () => {
    $api.app
      .list({
        size: 100,
        page: 1,
      })
      .then((res) => {
        let data = res.data
        appList.value = data.list;
      });
  };
  
  const getMuteStatus = () => {
    $api.appUser
      .getnospeaking({
        account: state.account,
      })
      .then((res) => {
        console.log(res)
        let data = res.data;
        form.C2CmsgNospeakingTime = data.C2CmsgNospeakingTime;
        form.GroupmsgNospeakingTime = data.GroupmsgNospeakingTime;
        if(data.C2CmsgNospeakingTime>0||data.GroupmsgNospeakingTime>0){
            state.isMute = true
        }else{
            state.isMute = false
        }
      });
  };
  
  watch(
    () => props.info,
    (val) => {
      // let { id, name, code, appid } = val;
      state.account = val.userID
      getMuteStatus();
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
        let params = {
          account: state.account,
          itemList: {
            C2CmsgNospeakingTime: Number(form.C2CmsgNospeakingTime),
            GroupmsgNospeakingTime: Number(form.GroupmsgNospeakingTime)
          }
        }
        editLoading.value = true;
        $api.appUser
          .setnospeaking(params)
          .then((res) => {
            if (res.result) {
              ElMessage({
                showClose: true,
                message: "设置成功",
              });
              emit("updateList");
              emit("closeModal");
            }
          })
          .finally(() => {
            editLoading.value = false;
          });
      }
    });
  };
  </script>
  <style lang="scss" scoped>
  .el-select {
    flex: 1;
  }
  </style>
  
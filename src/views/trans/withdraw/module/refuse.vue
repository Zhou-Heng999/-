<template>
  <el-dialog
          v-model="props.addVisible"
          width="600px"
          @close="emit('closeModal')"
          title="提现拒绝"
  >
    <div v-loading="loading" class="new">
      <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="right"
              label-width="150px"
      >
        <el-form-item label="拒绝原因：" prop="desType">
          <el-select v-model="form.desType" placeholder="选择">
            <el-option label="账户不存在" value="0"></el-option>
            <el-option label="卡号错误" value="1"></el-option>
            <el-option label="所属银行不符" value="2"></el-option>
            <el-option label="支行信息错误" value="3"></el-option>
            <el-option label="持卡人不符" value="4"></el-option>
            <el-option label="银行维护" value="5"></el-option>
            <el-option label="联系在线客服" value="6"></el-option>
            <el-option label="多账号套利请联系客服" value="7"></el-option>
            <el-option label="审计清算" value="8"></el-option>
            <el-option label="账号异常,请联系客服" value="9"></el-option>
            <el-option label="您的提U地址不是TRC20地址" value="10"></el-option>
            <el-option label="请您填写您个人提U的地址" value="11"></el-option>
            <el-option label="您提U地址错误，请联系客服" value="12"></el-option>
            <el-option label="系统检测到您提U地址异常，请联系客服" value="13"></el-option>
            <el-option label="CNY提现通道暂停，请使用USDT提现通道！" value="14"></el-option>
          </el-select>
        </el-form-item>
        <el-row class="flex-center" style="margin-top: 50px;">
          <el-button type="primary" :loading="addLoading" @click="submitForm()">
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
  import { ElMessage } from "element-plus";
  import { Plus } from "@element-plus/icons-vue";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  console.log(getCurrentInstance().appContext.config.globalProperties);
  const emit = defineEmits("closeModal");
  const props = defineProps({
    addVisible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: {},
    },
  });

  const addLoading = ref(false);
  const addVisible = ref(true);
  const rules = {};

  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    ids: [],
    desType: "0",
  });

  watch(
          () => props.info,
          (val) => {
            console.log("refuseInfo", val);
            let { ids } = val;
            form.ids = ids;
          },
          {
            immediate: true,
            deep: true,
          },
  );

  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        console.log('form', form)
        addLoading.value = true;
        $api.trans
                .refuse_withdraw({ids: JSON.stringify(form.ids), desType: form.desType})
                .then((res) => {
                  if (res.result) {
                    ElMessage({
                      type: "success",
                      showClose: true,
                      message: "拒绝成功",
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
<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    border: 1px dashed #8c939d;
    border-radius: 6px;
  }
  .avatar {
    width: 178px;
    height: 178px;
  }

</style>

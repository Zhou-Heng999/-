<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="认证信息"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >

      <el-form-item label="ID" prop="username">
        <el-input
          v-model="form.uid"
          disabled
        ></el-input>
      </el-form-item>

        <el-form-item label="账号" prop="username">
          <el-input
            v-model="form.username"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="nick">
          <el-input v-model="form.nick" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="身份证号" prop="no">
          <el-input v-model="form.no" placeholder="请输入身份证号" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <div class="flex-justify-end">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 修改
          </el-button>
        </div>
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
  addVisible: {
    type: Boolean,
    default: false,
  },
  info : [],
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  nick: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  no: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  uid: "",
  username : "",
  phone: "",
  no: "",
  nick : "",
});

onMounted(() => {
  form.uid = props.info[0]
  form.username = props.info[1]

  $api.player.authInfo({uid:form.uid})
  .then((res) => {
    form.no = res.data.card;
    form.phone = res.data.phone;
    form.nick = res.data.name;
  });
})

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.player
        .editAuthInfo(form)
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

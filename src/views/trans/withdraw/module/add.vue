<template>
  <el-dialog
    v-model="props.addVisible"
    width="600px"
    @close="emit('closeModal')"
    title="扣款"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="选择类型" prop="ty">
          <el-select v-model="form.ty" placeholder="选择类型">
            <el-option label="账户" value="1"></el-option>
            <el-option label="手机号" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号/手机号：" prop="phone">
          <el-input v-model="form.phone" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="扣款金额(元)：" prop="money">
          <el-input v-model="form.money" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="des">
          <el-input v-model="form.des" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="扣款凭证图片：" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :limit="1"
            :show-file-list="false"
            name="img"
            :http-request="uploadAd"
            element-loading-text="图片上传中"
            v-loading="uploadLoading"
          >
            <img
              v-if="form.imageUrl"
              :src="$setImageUrl(form.imageUrl)"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-row class="flex-center" style="margin-top: 50px">
          <el-button type="primary" :loading="addLoading" @click="submitForm()">
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
import { Plus } from "@element-plus/icons-vue";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const uploadLoading = ref(false);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
});

const fileList = ref([]);
const uploadAd = (content) => {
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      fileList.value = [{ name: res.data, url: res.url }];
      form.imageUrl = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};

const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  ty: [{ required: true, message: "请选择", trigger: "blur" }],
  phone: [{ required: true, message: "请输入", trigger: "blur" }],
  money: [{ required: true, message: "请输入金额", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  ty: "1",
  phone: "",
  money: "",
  des: "",
  imageUrl: "",
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("form", form);
      addLoading.value = true;
      $api.trans
        .withdraw(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "扣款成功",
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

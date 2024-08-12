<template>
  <el-dialog
    v-model="props.addVisible"
    width="700px"
    @close="emit('closeModal')"
    title="新增广告"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="排序号" prop="adIdx">
          <el-input v-model="form.adIdx" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="所在页面" prop="adType">
          <el-select v-model="form.adType" placeholder="所在页面">
            <el-option label="首页" value="1"></el-option>
            <el-option label="白皮书" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="imageUrl">
          <el-upload
            ref="imageRef"
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
        <el-form-item label="广告链接类型" prop="srcType">
          <el-select v-model="form.srcType" placeholder="广告链接类型">
            <el-option label="超文本" value="1"></el-option>
            <el-option label="超链接" value="2"></el-option>
            <el-option label="无跳转" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="html标题" prop="srcUrl" v-if="form.srcType == 1">
          <el-input v-model="form.htmlTitle" placeholder=""></el-input>
          <QuillEditor
            toolbar="essential"
            theme="snow"
            style="width: 100%"
            ref="myquil"
          />
        </el-form-item>
        <el-form-item label="超链接" prop="srcUrl" v-if="form.srcType == 2">
          <el-input v-model="form.srcUrl" placeholder=""></el-input>
        </el-form-item>
        <el-row class="flex-center" style="margin-top: 75px">
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
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

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

const myquil = ref(null);
const fileList = ref([]);
const imgeUrl = ref("");
const imageRef = ref(null);
const uploadAd = (content) => {
  imgeUrl.value = URL.createObjectURL(content.file);
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      // fileList.value = [{ name: res.data, url: imgeUrl.value }];
      form.imageUrl = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      imageRef.value.handleRemove(content.file);

      uploadLoading.value = false;
    });
};

const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  adIdx: [{ required: true, message: "请输入排序号", trigger: "blur" }],
  adType: [{ required: true, message: "请选择所在页面", trigger: "blur" }],
  name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
  imageUrl: [{ required: true, message: "请上传封面图片", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  adIdx: "",
  adType: "",
  name: "",
  imageUrl: "",
  srcType: "",
  srcUrl: "",
  htmlTitle: "",
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      if (form.srcType == 1) {
        form.srcUrl = myquil.value.getHTML();
      }
      addLoading.value = true;
      $api.pub
        .adAdd(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "新建成功",
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

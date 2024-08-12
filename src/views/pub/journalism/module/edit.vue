<template>
 <el-dialog
    v-model="props.addVisible"
    width="700px"
    @close="emit('closeModal')"
    title="新增新闻"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="新闻设置" prop="article">
          <Editor
            v-model="form.article"
            :value="form.article"
            @updateValue="getMsg"
          />
        </el-form-item>
        <el-form-item label="封面图片" prop="image">
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
              v-if="form.image"
              :src="$setImageUrl(form.image)"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
         <el-form-item label="作者名称" prop="author">
          <el-input v-model="form.author" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="作者头像" prop="author_avatar">
          <el-upload
            ref="imageRef2"
            class="avatar-uploader"
            :limit="1"
            :show-file-list="false"
            name="img"
            :http-request="uploadAd2"
            element-loading-text="图片上传中"
            v-loading="uploadLoading2"
          >
            <img
              v-if="form.author_avatar"
              :src="$setImageUrl(form.author_avatar)"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
import { createApp } from 'vue';
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Editor from "@/components/Editor/index.vue";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const uploadLoading = ref(false);
const uploadLoading2 = ref(false);
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
});

const myquil = ref(null);
const fileList = ref([]);
const imageRef = ref(null);
const imageRef2 = ref(null);


const uploadAd = (content) => {
  console.log(content);
  imgeUrl.value = URL.createObjectURL(content.file);
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  console.log("formData", formData);
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      // fileList.value = [{ name: res.data, url: imgeUrl.value }];
      form.image = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      imageRef.value.handleRemove(content.file);

      uploadLoading.value = false;
    });
};
const uploadAd2 = (content) => {
  console.log(content);
  imgeUrl.value = URL.createObjectURL(content.file);
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading2.value = true;
  console.log("formData", formData);
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      // fileList.value = [{ name: res.data, url: imgeUrl.value }];
      form.author_avatar = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      imageRef2.value.handleRemove(content.file);

      uploadLoading2.value = false;
    });
};

const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
  title: [{ required: true, message: "请输入新闻标题", trigger: "blur" }],
  image: [{ required: true, message: "请上传封面图片", trigger: "blur" }],
  author_avatar: [{ required: true, message: "请上传作者头像", trigger: "blur" }],
  author: [{ required: true, message: "请上传作者名称", trigger: "blur" }],
  article: [{ required: true, message: "请上传内容 ", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id:'',
  title: "",
  image: "",
  author_avatar:'',
  author:'',
  article: "",
});

watch(
  () => props.info,
  (val) => {
    console.log("editInfo", val);
    let { id, title, adType, image, author_avatar, author, article } = val;
    form.id = id;
    form.title = title;
    form.adType = adType;
    form.image = image;
    form.author_avatar = author_avatar;
    form.author = author;
    form.article = article;
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  myquil,
  (val) => {
    if (val && form.srcType == "1") {
      myquil.value.setHTML(form.srcUrl);
    }
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
      // if (form.srcType == 1) {
      //   form.srcUrl = myquil.value.getHTML();
      // } else if (form.srcType == 3) {
      //   form.srcUrl = "";
      // }
      console.log("form", form);
      editLoading.value = true;
      $api.news
        .edit(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
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

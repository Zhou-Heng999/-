<template>
  <el-dialog
    v-model="props.addVisible"
    width="1000px"
    @close="emit('closeModal')"
    title="编辑商品"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入" />
        </el-form-item>

        <!-- <el-form-item label="成本" prop="cost">
        <el-input v-model="form.cost" placeholder="请输入" />
      </el-form-item> -->

        <el-form-item label="类型" prop="item_type">
          <el-select v-model="form.item_type" defaultSelect="form.item_type">
            <el-option
              v-for="item in state.typelist"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="兑换消耗积分" prop="exchange_points">
          <el-input v-model="form.exchange_points" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="兑换总量" prop="exchange_num">
          <el-input v-model="form.exchange_num" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="兑换次数上限 /人" prop="exchange_limit">
          <el-input v-model="form.exchange_limit" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="剩余数量" prop="exchange_rest">
          <el-input v-model="form.exchange_rest" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="商品描述" prop="memo">
          <el-input v-model="form.memo" type="textarea" :rows="4"></el-input>
        </el-form-item>

        <el-form-item label="小图(200*200)" prop="img_small">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="uploadPic"
            data="img_small"
            :before-upload="beforeAvatarUpload"
            element-loading-text="图片上传中"
            v-loading="uploadLoading"
          >
            <img
              v-if="form.img_small"
              :src="$imgeUrl + form.img_small"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="大图(270*270)" prop="img_big">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="uploadPic"
            data="img_big"
            element-loading-text="图片上传中"
            :before-upload="beforeAvatarUpload"
            v-loading="uploadLoading"
          >
            <img
              v-if="form.img_big"
              :src="$imgeUrl + form.img_big"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图(最多8張)(750*750)" prop="img_detail">
          <el-upload
            :limit="8"
            list-type="picture-card"
            multiple
            :http-request="uploadPicMore"
            data="img_detail"
            v-model:file-list="img_detail"
            :on-exceed="handleExceed"
            element-loading-text="图片上传中"
            v-loading="uploadLoading"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情(最多8張)(750*1314)" prop="img_exchange">
          <el-upload
            :limit="8"
            v-model:file-list="img_exchange"
            list-type="picture-card"
            :http-request="uploadPicMore"
            multiple
            data="img_exchange"
            :on-exceed="handleExceed"
            element-loading-text="图片上传中"
            v-loading="uploadLoading"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div class="flex-center">
        <el-button
          size="small"
          type="primary"
          :loading="addLoading"
          @click="submitForm()"
        >
          <i class="fa fa-plus"> </i> 确认修改
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { ElMessage } from "element-plus";

import { Plus } from "@element-plus/icons-vue";
const { $api, $imgeUrl } =
  getCurrentInstance().appContext.config.globalProperties;
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
const state = reactive({
  typelist: [],
});

const img_detail = ref([]);
const img_exchange = ref([]);

onMounted(() => {
  getItemsTypeList();
});

const getItemsTypeList = () => {
  $api.items.typelist({}).then((res) => {
    state.typelist = res.data;
  });
};
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
  exchange_num: [{ required: true, message: "请选择", trigger: "blur" }],
  name: [{ required: true, message: "请输入", trigger: "blur" }],
  exchange_limit: [{ required: true, message: "请输入", trigger: "blur" }],
  cost: [{ required: true, message: "请输入", trigger: "blur" }],
  recovery_coin: [{ required: true, message: "请输入", trigger: "blur" }],
  exchange_rest: [{ required: true, message: "请输入", trigger: "blur" }],
  item_type: [{ required: true, message: "请输入", trigger: "blur" }],
  // img_small: [{ required: true, message: "请输入", trigger: "blur" }],
  // img_big: [{ required: true, message: "请输入", trigger: "blur" }],
  exchange_coin: [{ required: true, message: "请输入", trigger: "blur" }],
  exchange_points: [{ required: true, message: "请输入", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  img_detail: [],
  img_small: "",
  img_big: "",
  exchange_points: "",
  exchange_num: "",
  exchange_limit: "",
  memo: "",
  name: "",
  item_type: "",
  exchange_rest: "",
});

const handleExceed = () => {
  ElMessage.warning("最多只能上传8张照片");
};

const uploadLoading = ref(false);
const uploadPic = (content) => {
  let { data } = content;

  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      if (res.result) {
        form[data] = res.url;
      } else {
        ElMessage({
          showClose: true,
          message: "上传图片失败",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};

const uploadPicMore = (content) => {
  let { data } = content;

  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  console.log("uploadLoading....", true);
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      if (res.result) {
        var _data = eval(data);
        for (var i in _data.value) {
          if (_data.value[i]["name"] == content.file.name) {
            _data.value[i]["url"] = $imgeUrl + res.url;
          }
        }
      } else {
        ElMessage({
          showClose: true,
          message: "上传图片失败",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
      console.log("uploadLoading....", false);
    });
};

const handleRemove = () => {
  console.log("form...", form);
};

const beforeAvatarUpload = (content) => {
  if (content.size / 1024 / 1024 > 1) {
    ElMessage({
      type: "error",
      showClose: true,
      message: "picture size can not exceed 1MB!",
    });

    return false;
  }
  return true;
};

watch(
  () => props.info,
  (val) => {
    console.log("val", val);
    for (let i in form) {
      form[i] = val[i];
    }

    val.img_detail.forEach((item) => {
      item.url = $imgeUrl + item.url;
    });
    val.img_exchange.forEach((item) => {
      item.url = $imgeUrl + item.url;
    });
    form.item_type = val.type;
    form.idx = val.id;
    img_detail.value = val.img_detail;
    img_exchange.value = val.img_exchange;
  },
  {
    immediate: true,
  }
);
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;
      var _detail = [];
      for (var i in img_detail.value) {
        _detail.push(img_detail.value[i]["url"].replace($imgeUrl, ""));
      }
      form.img_detail = _detail.join(",");

      var _exchange = [];
      for (var i in img_exchange.value) {
        _exchange.push(img_exchange.value[i]["url"].replace($imgeUrl, ""));
      }
      form.img_exchange = _exchange.join(",");

      $api.items
        .itemsUpdate(form)
        .then((res) => {
          console.log("form", res);
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
      // 此处暂时省去异步接口处理
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
  width: 100px;
  height: 100px;
  text-align: center;
  border: 1px dashed #8c939d;
  border-radius: 6px;
}
.avatar {
  width: 100px;
  height: 100px;
}
</style>

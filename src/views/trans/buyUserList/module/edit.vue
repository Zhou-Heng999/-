<template>
  <el-dialog
    v-model="props.addVisible"
    width="600px"
    @close="emit('closeModal')"
    title="编辑提现商户"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="商户名：" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="VIP等级：" prop="vipLevel">
          <el-input v-model="form.vipLevel" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
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
              v-if="form.icon"
              :src="$setImageUrl(form.icon)"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="汇率：" prop="uintPrice">
          <el-space>
            <span>1USDT=</span>
            <el-input
              v-model="form.uintPrice"
              placeholder="请输入汇率"
            ></el-input>
            <el-select
              v-model="form.code"
              placeholder="选择"
              @change="choseBank"
            >
              <el-option
                :value="u.id"
                :key="index"
                :label="u.name"
                v-for="(u, index) in iconList"
              ></el-option>
            </el-select>
          </el-space>
        </el-form-item>
        <el-form-item label="数量：" prop="quantity">
          <el-input v-model="form.quantity" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="成交率(%)：" prop="closeRate">
          <el-input v-model="form.closeRate" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="限额：" prop="minLimit">
          <el-input
            v-model="form.minLimit"
            placeholder=""
            style="width: 200px"
          ></el-input>
          -
          <el-input
            v-model="form.maxLimit"
            placeholder=""
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="isOpen">
          <el-switch v-model="form.isOpen" />
        </el-form-item>

        <el-row class="flex-center" style="margin-top: 50px">
          <el-button type="primary" :loading="addLoading" @click="submitForm()">
            <i class="fa fa-plus"> </i> 保存
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

const { $api, $imgeUrl } =
  getCurrentInstance().appContext.config.globalProperties;
const uploadLoading = ref(false);
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
const iconList = [
  { name: "USD", id: "USD" },
  { name: "CNY", id: "CNY" },
  { name: "PHP", id: "PHP" },
];
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
      form.icon = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};

const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
  name: [{ required: true, message: "请输入", trigger: "blur" }],
  vipLevel: [{ required: true, message: "请输入", trigger: "blur" }],
  uintPrice: [{ required: true, message: "请输入", trigger: "blur" }],
  quantity: [{ required: true, message: "请输入", trigger: "blur" }],
  minLimit: [{ required: true, message: "请输入", trigger: "blur" }],
  isOpen: [{ required: true, message: "请选择", trigger: "blur" }],
  icon: [{ required: true, message: "请上传图标", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  name: "",
  vipLevel: "",
  uintPrice: "",
  quantity: "",
  closeRate: "",
  minLimit: "",
  maxLimit: "",
  isOpen: false,
  icon: "",
});

watch(
  () => props.info,
  (val) => {
    console.log("editInfo", val);
    let {
      id,
      name,
      vipLevel,
      uintPrice,
      quantity,
      closeRate,
      minLimit,
      maxLimit,
      isOpen,
      icon,
      code,
    } = val;
    form.id = id;
    form.name = name;
    form.vipLevel = vipLevel;
    form.uintPrice = uintPrice;
    form.quantity = quantity;
    form.closeRate = closeRate;
    form.minLimit = minLimit;
    form.maxLimit = maxLimit;
    form.isOpen = isOpen;
    form.icon = icon;
    form.code = code;
  },
  {
    immediate: true,
    deep: true,
  }
);

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("form", form);
      editLoading.value = true;
      $api.trans
        .edit_buyer(form)
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

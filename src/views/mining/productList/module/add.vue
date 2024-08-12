<template>
  <el-dialog
    v-model="props.addVisible"
    width="800px"
    @close="emit('closeModal')"
    title="新增产品"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="200px"
      >
        <el-form-item label="序号" prop="p_index">
          <el-input v-model="form.p_index" placeholder="请输入序号"></el-input>
        </el-form-item>

        <el-form-item label="矿机名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入矿机名称" />
        </el-form-item>

        <el-form-item label="是否连续签到30天免费" prop="is_free">
          <el-radio-group v-model="form.is_free">
            <el-radio label="1" size="large">否</el-radio>
            <el-radio label="0" size="large">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="矿机头像" prop="imageUrl">
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

        <el-form-item label="购买价格(USDT)" prop="price">
          <el-input v-model="form.price" placeholder="请输入购买价格" />
        </el-form-item>

        <el-form-item label="挖矿期限单位" prop="term_type">
          <el-radio-group v-model="form.term_type">
            <el-radio label="1" size="large">小时</el-radio>
            <el-radio label="2" size="large">天</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="挖矿期限" prop="term_value">
          <el-input v-model="form.term_value" placeholder="请输入挖矿期限" />
        </el-form-item>

        <el-form-item label="可持最大数量" prop="max_quantity">
          <el-input
            v-model="form.max_quantity"
            placeholder="请输入可持最大数量"
          />
        </el-form-item>

        <el-form-item label="挖矿收益(TRX/小时)" prop="per_profit">
          <el-input v-model="form.per_profit" placeholder="请输入收益" />
        </el-form-item>

        <el-row class="btn-container">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认添加
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue";
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
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  p_index: [{ required: true, message: "请输入序号", trigger: "blur" }],
  name: [{ required: true, message: "请输入名字", trigger: "blur" }],
  imageUrl: [
    { required: true, message: "请上传矿机头像图片", trigger: "blur" },
  ],
  price: [{ required: true, message: "请输入购买价格", trigger: "blur" }],
  per_profit: [{ required: true, message: "请输入收益", trigger: "blur" }],
  term_type: [
    { required: true, message: "请输入挖矿期限单位", trigger: "blur" },
  ],
  term_value: [{ required: true, message: "请输入挖矿期限", trigger: "blur" }],
  max_quantity: [
    { required: true, message: "请输入最大持有数量", trigger: "blur" },
  ],
  is_free: [
    { required: true, message: "请输入是否30天签到免费", trigger: "blur" },
  ],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  p_index: "",
  name: "",
  imageUrl: "",
  price: "",
  per_profit: "",
  term_type: "",
  term_value: "",
  max_quantity: "",
  is_free: "",
});

const fileList = ref([]);
const uploadLoading = ref(false);
const imgeUrl = ref("");
const uploadAd = (content) => {
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      fileList.value = [{ name: res.data, url: imgeUrl.value }];
      form.imageUrl = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.mining
        .addProduct(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "添加成功",
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

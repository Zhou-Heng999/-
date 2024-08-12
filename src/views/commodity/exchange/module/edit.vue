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
        <el-form-item label="订单状态" prop="order_status">
          <el-select
            v-model="form.order_status"
            defaultSelect="form.order_status"
          >
            <el-option
              v-for="item in orderStatusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" prop="address_name">
          <el-input v-model="form.address_name" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="手机号码" prop="address_phone">
          <el-input v-model="form.address_phone" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="收件地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div class="flex-center max-wdith">
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
});
const state = reactive({
  typelist: [],
});

const img_detail = ref([]);
const img_exchange = ref([]);
const orderStatusList = [
  { name: "进行", value: 0 },
  { name: "完成", value: 1 },
];
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
  address_name: "",
  address_phone: "",
  address: "",
  order_status: "",
  remark: "",
  id: "",
});

const handleExceed = () => {
  ElMessage.warning("最多只能上传8张照片");
};

watch(
  () => props.info,
  (val) => {
    for (let i in form) {
      form[i] = val[i];
    }
    form.id = val.id;
  },
  {
    immediate: true,
  }
);
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;

      $api.items
        .order_edit(form)
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

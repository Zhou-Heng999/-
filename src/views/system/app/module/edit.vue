<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑应用"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="应用名称" prop="name">
           <!-- <el-select v-model="form.name">
            <el-option
              v-for="item in tagData"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select> -->
          <el-input v-model="form.name" placeholder="请输入渠道名称"></el-input>
        </el-form-item>
        <el-form-item label="sdkappid" prop="sdkappid">
          <el-input v-model="form.sdkappid" disabled placeholder="请输入sdkappid" />
        </el-form-item>

        <el-form-item label="密钥" prop="secret">
          <el-input v-model="form.secret" placeholder="请输入密钥" />
        </el-form-item>

        <el-form-item label="回调密钥" prop="cb_token">
          <el-input v-model="form.cb_token" placeholder="请输入回调密钥" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="editLoading"
            type="primary"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认修改
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
const statusData = ref([
  {
    id:0,
    name:'上架'
  },
  {
    id:1,
    name:'下架'
  }
]);
const rules = {
  name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
  cb_token: [{ required: true, message: "请输入回调密钥", trigger: "blur" }],
  secret: [{ required: true, message: "请输入密钥", trigger: "blur" }],
  sdkappid: [{ required: true, message: "请输入sdkappid", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  name: "",
  sdkappid: "",
  secret: "",
  cb_token: "",
  remark: ""
});

watch(
  () => props.info,
  (val) => {
    let { id, name, sdkappid, secret, cb_token,remark } = val;
    form.id = id,
    form.name = name;
    form.sdkappid = sdkappid;
    form.secret = secret;
    form.cb_token = cb_token;
    form.remark = remark;
    // console.log("editInfo", val);
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
      editLoading.value = true;
      $api.app
        .update(form)
        .then((res) => {
          console.log("form", res);
          if (res.result) {
            ElMessage({
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
.el-select {
  flex: 1;
}
</style>

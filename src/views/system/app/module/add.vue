<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="新增应用"
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
          <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
        </el-form-item>

        <el-form-item label="sdkappid" prop="sdkappid">
          <el-input v-model="form.sdkappid" type="text" placeholder="请输入sdkappid" />
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
const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  roleData : [],
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  name: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
  cb_token: [{ required: true, message: "请输入回调密钥", trigger: "blur" }],
  secret: [{ required: true, message: "请输入密钥", trigger: "blur" }],
  sdkappid: [{ required: true, message: "请输入sdkappid", trigger: "blur" }],
  // remark: [{ required: true, message: "请输入remark", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  name: "",
  sdkappid: "",
  secret: "",
  cb_token: "",
  remark: ""
});
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
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.app
        .add(form)
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
<style lang="scss" scoped>.el-select {
  flex: 1;
}</style>

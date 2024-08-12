<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="添加菜单"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="菜单名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名字" />
        </el-form-item>

        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入URL" />
        </el-form-item>

        <el-form-item label="菜单组" prop="group_name">
          <el-input v-model="form.group_name" placeholder="请输入菜单组名称" />
        </el-form-item>

        <el-form-item label="顺序编号" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入顺序编号" />
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
import { onMounted } from "vue";
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
  menuData: [],
});
const defaultProps = {
  children: "children",
  label: "label",
};
const addLoading = ref(false);
const addVisible = ref(true);

const formRef = ref();
const loading = ref(false);
const form = reactive({
  name: "",
  url: "",
  group_name: "",
});
onMounted(() => {});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.roles
        .menuAdd(form)
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
<style lang="scss" scoped></style>

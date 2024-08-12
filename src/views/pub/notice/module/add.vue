<template>
  <el-dialog
          v-model="props.addVisible"
          width="500px"
          @close="emit('closeModal')"
          title="添加公告"
  >
    <div v-loading="loading" class="new">
      <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="right"
              label-width="100px"
      >
        <el-form-item label="排序号" prop="index">
          <el-input v-model="form.index" placeholder="" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="createDate">
          <el-date-picker v-model="form.createDate" type="datetime" value-format="x"/>
        </el-form-item>
        <el-row class="flex-center" style="margin-top: 75px;">
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
    index: [{ required: true, message: "请输入排序号", trigger: "blur" }],
    title: [{ required: true, message: "请输入标题", trigger: "blur" }],
    content: [{ required: true, message: "请输入内容", trigger: "blur" }],
    createDate: [{ required: true, message: "请输入时间", trigger: "blur" }],
  };

  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    index: "",
    title: "",
    content: "",
    createDate: "",
  });

  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        form.createDate = form.createDate / 1000
        console.log('form', form)
        addLoading.value = true;
        $api.pub
                .addNotice(form)
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
</style>

<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="回复"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="回复语" prop="reply">
          <el-input
            v-model="form.reply"
            type="text"
            placeholder="请输入回复语"
          />
        </el-form-item>
        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="editLoading"
            type="primary"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认回复
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
  tagData: [],
});
const addVisible = ref(true);
const editLoading = ref(false);

const rules = {
  reply: [{ required: true, message: "请输入发送内容", trigger: "blur" }],

};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  reply: "",
  id: "",
});


watch(
  () => props.info,
  (val) => {
    console.log(val);
    form.id = val.id;
  },
  {
    immediate: true,
    deep: true,
  }
);

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;
      $api.appFeedback
        .feedbackReply(form)
        .then((res) => {
          console.log("form", res);
          if (res.result) {
            ElMessage({
              showClose: true,
              message: "回复成功",
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
.el-select {
  flex: 1;
}
</style>
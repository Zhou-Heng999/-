<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="常用语" prop="phrase">
          <el-input
            v-model="form.phrase"
            type="text"
            placeholder="请输入常用语"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="editLoading"
            type="primary"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认编辑
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
  phrase: [{ required: true, message: "请输入发送内容", trigger: "blur" }],
  sort: [{ required: true, message: "请输入发送内容", trigger: "blur" }],

};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  phrase: "",
  id: "",
  sort:null
});

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;
      form.sort = Number(form.sort)
      $api.appPhrase
        .appPhraseUpdate(form)
        .then((res) => {
          console.log("form", res);
          if (res.result) {
            ElMessage({
              showClose: true,
              message: "修改成功",
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

watch(
  () => props.info,
  (val) => {
    console.log(val);
    form.phrase = val.phrase;
    form.id = val.id;
    form.sort = val.sort;
    
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="scss" scoped>
.el-select {
  flex: 1;
}
</style>
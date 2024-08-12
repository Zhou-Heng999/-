<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑币种"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
           <!-- <el-select v-model="form.name">
            <el-option
              v-for="item in tagData"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select> -->
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入标识" />
        </el-form-item>

        <el-form-item label="排序" prop="idx">
          <el-input v-model="form.idx" type="idx" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <!-- <el-input
            v-model="form.status"
            type="status"
            placeholder="请输入排序"
          /> -->
        </el-form-item>
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
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  tag: [{ required: true, message: "请输入标识", trigger: "blur" }],
  idx: [{ required: true, message: "请输入排序", trigger: "blur" }],
  status: [{ required: true, message: "请输入状态", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: null,
  name: "",
  tag: "",
  idx: "",
  status: null,
});

watch(
  () => props.info,
  (val) => {
    let { id, name, tag, idx, status } = val;
    form.name = name;
    form.tag = tag;
    form.id = id;
    form.idx = idx;
    form.status = status;
    console.log("editInfo", val);
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

      $api.currency
        .edit(form)
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

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
        <el-form-item label="渠道" prop="name">
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
        <el-form-item label="渠道代码" prop="code">
          <el-input v-model="form.code" type="text" placeholder="请输入渠道代码" />
        </el-form-item>
        
        <el-form-item label="应用" prop="appid">
          <el-select v-model="form.appid">
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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

const rules = {
  name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入渠道代码", trigger: "blur" }],
  appid: [{ required: true, message: "请选择应用", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  name: "",
  code: "",
  appid: ""
});
const appList = ref([]);

const getAppList = () => {
  $api.app
    .list({
      size: 100,
      page: 1,
    })
    .then((res) => {
      let data = res.data
      appList.value = data.list;
    });
};

watch(
  () => props.info,
  (val) => {
    let { id, name, code, appid } = val;
    form.id = id,
    form.code = code;
    form.name = name;
    form.appid = appid;
    console.log("editInfo", val);
    getAppList();
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
      $api.channel
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

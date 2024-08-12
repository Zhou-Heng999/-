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
        <el-form-item label="渠道名称" prop="name">
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
          <el-input v-model="form.code" disabled type="text" placeholder="请输入渠道代码" />
        </el-form-item>
        
        <el-form-item label="应用" disabled prop="sdkappid">
          <el-select v-model="form.sdkappid">
            <el-option
              v-for="item in appList"
              :key="item.sdkappid"
              :label="item.name"
              :value="item.sdkappid"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="社交模式" prop="allow_type">
          <el-select v-model="form.allow_type">
            <el-option
              v-for="item in allowTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
         <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" type="text" placeholder="请输入URL" />
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

const allowTypeList = [
  {name: '陌生人社交',key:1},
  {name: '熟人社交',key:2},
  {name: '拒绝社交',key:3},
]


const rules = {
  name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入渠道代码", trigger: "blur" }],
  sdkappid: [{ required: true, message: "请选择应用", trigger: "blur" }],
  allow_type: [{ required: true, message: "请选择社交方式", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  name: "",
  code: "",
  sdkappid: "",
  allow_type: "",
  url:""
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
    let { id, name, code, sdkappid,allow_type,url } = val;
    form.id = id,
    form.code = code;
    form.name = name;
    form.url = url;
    form.sdkappid = sdkappid;
    form.allow_type = allow_type;
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

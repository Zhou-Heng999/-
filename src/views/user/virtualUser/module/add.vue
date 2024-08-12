<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="新增虚拟用户"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
      <!-- <el-form-item label="渠道" prop="channel">
          <el-select v-model="form.channel">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nick">
          <el-input v-model="form.nick" placeholder="请输入昵称"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender">
            <el-option
              v-for="item in genderlList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        
        <el-form-item label="个性签名" prop="selfSignature">
          <el-input v-model="form.selfSignature" placeholder="请输入个性签名"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="location">
          <el-input v-model="form.location" placeholder="请输入地址"></el-input>
        </el-form-item>
        
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="form.birthday" placeholder="格式：20120314"></el-input>
        </el-form-item>

        <el-form-item label="加入的群" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入群ID"></el-input>
        </el-form-item>
        
        
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
import { getCurrentInstance,watch } from "@vue/runtime-core";
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
  // channel: [{ required: true, message: "请选择渠道", trigger: "blur" }],
  account: [{ required: true, message: "请入账号", trigger: "blur" }],
  // gender: [{ required: true, message: "请选择性别选项", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  // channel: "",
  gender: "",
  account: "",
  nick: "",
  gender: "",
  selfSignature: "",
  location: "",
  birthday: "",
  groupId: ""
});
const channelList = ref([
  
]);

const genderlList = ref([
  {name: '不设置',key: 'Gender_Type_Unknown'},
  {name: '男',key: 'Gender_Type_Male'},
  {name: '女',key: 'Gender_Type_Female'},
])

watch(
  () => props.addVisible,
  (val) => {
    if(val){
      // getChannelList()
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
const onSuccess = (val) => {};
const handleClickChoose = () => {};

const getChannelList = () => {
  $api.channel
    .list({
      size: 200,
      page: 1,
    })
    .then((res) => {
      let data = res.data
      channelList.value = data.list;
    });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      let arr = [];
      arr.push(form)
      let params = {
        list: arr
      }
      $api.appUser
        .import_account(params)
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

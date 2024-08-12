<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="详情"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
      <el-form-item label="昵称" prop="name">
          <el-input v-model="form.Tag_Profile_IM_Nick" type="text" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="性别" prop="code">
           <el-select v-model="form.Tag_Profile_IM_Gender">
            <el-option
              v-for="item in genderList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
          <!-- <el-input v-model="form.name" placeholder="请输入渠道名称"></el-input> -->
        </el-form-item>

        <el-form-item label="个性签名" prop="code">
          <el-input v-model="form.Tag_Profile_IM_SelfSignature" type="text" placeholder="请输入个性签名" />
        </el-form-item>
        
        <el-form-item label="好友验证方式" prop="code">
          <el-select v-model="form.Tag_Profile_IM_AllowType">
            <el-option
              v-for="item in confirmList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="加好友权限" prop="code">
          <el-select v-model="form.Tag_Profile_IM_AdminForbidType">
            <el-option
              v-for="item in addPowerList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
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

const state = reactive({
  account: ''
})

const rules = {
  // name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  // code: [{ required: true, message: "请输入渠道代码", trigger: "blur" }],
  // appid: [{ required: true, message: "请选择应用", trigger: "blur" }],
};

const genderList = ref([
  {name: '不设置',key: 'Gender_Type_Unknown'},
  {name: '男',key: 'Gender_Type_Male'},
  {name: '女',key: 'Gender_Type_Female'}
])

const confirmList = ref([
  {name: '需验证同意',key:'AllowType_Type_NeedConfirm'},
  {name: '允许任何人',key:'AllowType_Type_AllowAny'},
  {name: '不允许任何人',key:'AllowType_Type_DenyAny'}
])

const addPowerList = ref([
  {name: '允许加好友',key:'AdminForbid_Type_None'},
  {name: '禁止加好友',key:'AdminForbid_Type_SendOut'},
])


const formRef = ref();
const loading = ref(false);
const form = reactive({
  //昵称、性别、个性签名、加好友验证方式、加好友权限
  Tag_Profile_IM_Nick: '',
  Tag_Profile_IM_Gender: '',
  Tag_Profile_IM_SelfSignature: '',
  Tag_Profile_IM_AllowType: '',
  Tag_Profile_IM_AdminForbidType: ''
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

const getUserInfo = () => {
  const list = Object.keys(form);
  const accountList = [`${state.account}`]
  $api.appUser
    .portrait_get({
      accountList: accountList,
      itemList: list
    })
    .then((res) => {
      // console.log(res)
      let data = res.data[0].ProfileItem;
      data.forEach(item => {
        form[item.Tag] = item.Value
      });
      console.log(form)
    });
};

watch(
  () => props.info,
  (val) => {
    // let { id, name, code, appid } = val;
    state.account = val.userID
    getUserInfo();
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
      let list = []
      for(let i in form){
        list.push({
          Tag: i,
          Value: form[i]
        })
      }
      let params = {
        account: state.account,
        itemList: list
      }
      editLoading.value = true;
      $api.appUser
        .portrait_set(params)
        .then((res) => {
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
    }
  });
};
</script>
<style lang="scss" scoped>
.el-select {
  flex: 1;
}
</style>

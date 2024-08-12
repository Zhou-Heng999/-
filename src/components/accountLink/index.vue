<template>
    <el-link type="primary" @click="showUserDetail(scope.row.userID)">{{scope.row.userID}}</el-link>
    <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
  </template>
  
  <script setup>
  import editModal from "@/components/userDetail/index.vue";
  import { ref, reactive } from "@vue/reactivity";
  import { getCurrentInstance, watch } from "@vue/runtime-core";
  import mixins from "@/mixins/list";
  const { setTimestamp } = mixins();
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
  const isEditShow = ref(false);
  
  const state = reactive({
    account: '',
    userInfo: {}
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
  
  const showUserDetail = (account) => {
    let info = {
        account: account
    }
    editInfo.value = info;
    isDetailShow.value = true;
}
  
  const getUserInfo = () => {
    // const list = Object.keys(form);
    // const accountList = [`${state.account}`]
    $api.appUser
      .info({
        account: state.account,
        // accountList: accountList,
        // itemList: list
      })
      .then((res) => {
        // console.log(res.data)
        let data = res.data
        state.userInfo = data
        // let arr = data.profile[0].ProfileItem;
        // if(arr){
        //   arr.forEach(item => {
        //     form[item.Tag] = item.Value
        //   });
        // }
        form.Tag_Profile_IM_AdminForbidType = data.Tag_Profile_IM_AdminForbidType;
        form.Tag_Profile_IM_AllowType = data.Tag_Profile_IM_AllowType;
        form.Tag_Profile_IM_Gender = data.Tag_Profile_IM_Gender;
        form.Tag_Profile_IM_Nick = data.Tag_Profile_IM_Nick;
        form.Tag_Profile_IM_SelfSignature = data.Tag_Profile_IM_SelfSignature;
        if(!form.Tag_Profile_IM_Gender){
          form.Tag_Profile_IM_Gender = 'Gender_Type_Unknown'
        }
      });
  };
  
  watch(
    () => props.info,
    (val) => {
      // let { id, name, code, appid } = val;
      state.account = val.account
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
                type: 'success',
                showClose: true,
                message: "设置成功",
              });
              // emit("updateList");
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
  
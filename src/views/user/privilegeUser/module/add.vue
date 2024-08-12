<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="添加好友"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        
        <el-form-item label="账号" prop="To_Account">
          <el-input v-model="form.To_Account" type="textarea" placeholder="请输入账号，多个用逗号隔开" />
        </el-form-item>
        
        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="addLoading"
            type="primary"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认添加
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
  <!-- 添加结果弹窗 -->
  <el-dialog v-model="state.isShowResult" width="600px" @close="state.isShowResult=false" title="添加结果">
    <div class="flex-wrap">
      {{ state.resultData }}添加失败
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
  account: '',
  tableData: {
    type: Array,
    default: [],
  }
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  To_Account: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
  // code: [{ required: true, message: "请输入渠道代码", trigger: "blur" }],
  // appid: [{ required: true, message: "请选择应用", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  To_Account: "",
});
const appList = ref([
  
]);

const state = reactive({
  isShowResult: false,
  resultData: ''
})

watch(
  () => props.addVisible,
  (val) => {
    if(val){
      // getAppList()
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
const onSuccess = (val) => {};
const handleClickChoose = () => {};

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

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      
      let arr = form.To_Account.split(",")
      if(arr.includes(props.account)){
        ElMessage({
          type: "error",
          showClose: true,
          message: "不允许添加账号本身为好友",
        });
        return
      }

      for(let i in arr){
        let idx = props.tableData.findIndex(itm=>itm.To_Account==arr[i])
        if(idx >= 0){
          ElMessage({
            type: "error",
            showClose: true,
            message: `${arr[i]}已是好友`,
          });
          return
        }
      }

      $api.appUserFriend
        .add({
            From_Account: props.account,
            accountlist: arr,
        })
        .then((res) => {
          if(res.data.Fail_Account && res.data.Fail_Account.length!=0){
            const str = res.data.Fail_Account.join(',')
            state.resultData = str;
            state.isShowResult = true;
          }else{
            if (res.result) {
              ElMessage({
                type: "success",
                showClose: true,
                message: "添加成功",
              });
            }
          }
          emit("updateList");
          emit("closeModal");

          // if (res.result) {
          //   ElMessage({
          //     type: "success",
          //     showClose: true,
          //     message: "添加成功",
          //   });
          //   emit("updateList");
          //   emit("closeModal");
          // }
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

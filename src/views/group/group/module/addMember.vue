<template>
  <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="新增群员">
    <div v-loading="loading" class="new">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="用户账号" prop="name">
          <el-input v-model="form.memberList" type="textarea" placeholder="请输入账号，多个可用','隔开"></el-input>
        </el-form-item>

        <el-row class="btn-container">
          <el-button size="small" :loading="addLoading" type="primary" @click="submitForm()">
            <i class="fa fa-plus"> </i> 确认添加
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>

  <!-- 添加结果弹窗 -->
  <el-dialog v-model="state.isShowResult" width="600px" @close="state.isShowResult=false" title="添加结果">
    <div class="flex-column">
      <div class="mb20" v-if="state.resultData['0']">添加失败：{{ state.resultData['0'] }}</div>
      <div class="mb20" v-if="state.resultData['1']">添加成功：{{ state.resultData['1'] }}</div>
      <div class="mb20" v-if="state.resultData['2']">已经是群成员：{{ state.resultData['2'] }}</div>
      <div class="" v-if="state.resultData['3']">等待通过：{{ state.resultData['3'] }}</div>
    </div>
  </el-dialog>
</template>
  
<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
//   console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  roleData: [],
  groupId: ''
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  memberList: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  memberList: "",
});

const state = reactive({
  isShowResult: false,
  resultData: {}
})

const addReasult = {
  '0': '失败',
  '1': '成功',
  '2': '已经是群成员',
  '3': '等待被邀请者或者管理员审核'
}

//   watch(
//     () => props.addVisible,
//     (val) => {
//       if(val){

//       }
//     },
//     {
//       immediate: true,
//       deep: true,
//     }
//   );

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let list = form.memberList.split(",")
      let params = {
        groupId: props.groupId,
        memberList: list
      }
      addLoading.value = true;
      $api.chatGroupMember
        .add(params)
        .then((res) => {
          let reList = {
            '0': '',
            '1': '',
            '2': '',
            '3': ''
          }
          res.data.forEach(item => {
            reList[item.Result] = reList[item.Result] + `${reList[item.Result] == '' ? '' : ','}` + item.Member_Account
          })
          state.resultData = reList
          state.isShowResult = true
          emit("updateList");
          emit("closeModal");
        })
        .finally(() => {
          addLoading.value = false;
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
  
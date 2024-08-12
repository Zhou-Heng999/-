<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="认证信息"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-descriptions
          class="margin-top"
          title="详细信息"
          :column="2"
          :size="size"
          border
        >
          <el-descriptions-item>
            <template #label
              ><div class="cell-item">会员ID:</div></template
            >
            {{ 111111111111111111}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label
              ><div class="cell-item">会员账号:</div></template
            >
            {{ 111111111111111111}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label
              ><div class="cell-item">绑定手机号:</div></template
            >
            {{ 1 }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label
              ><div class="cell-item">绑定邮箱:</div></template
            >
            {{ 1 }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><div class="cell-item">国籍:</div></template
            >
            {{ 1 }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><div class="cell-item">姓名:</div></template
            >
            {{ 1 }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><div class="cell-item">证件类型:</div></template
            >
            {{ 1 }}
          </el-descriptions-item>
        </el-descriptions>
        <el-row class="btn-container">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info: [],
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  nick: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  no: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  uid: "",
  username: "",
  phone: "",
  no: "",
  nick: "",
});

onMounted(() => {
  //   form.uid = props.info[0]
  //   form.username = props.info[1]
    $api.playerinfo.marketAccountInfo({uid:info.uid})
    .then((res) => {
      console.log(res);
    });
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  emit("closeModal");
};
</script>
<style lang="scss" scoped></style>

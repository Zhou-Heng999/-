<template>
  <el-dialog
    @close="close"
    v-model="props.dialogVisible"
    width="30%"
    title="谷歌验证码"
  >
    <el-input
      v-model.number="googleNumber"
      placeholder="请输入谷歌验证码"
    ></el-input>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confrimCode">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits("closeModal", "confrim");
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const googleNumber = ref();
const confrimCode = () => {
  emit("confrim", googleNumber.value);
  close();
};

const close = () => {
  emit("closeModal");
};
</script>
<style lang="scss" scoped></style>

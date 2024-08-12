<template>
  <el-dialog
    v-model="props.dialogVisible"
    @close="close"
    width="25%"
    append-to-body
    title="个人信息"
  >
    <!-- <div class="account-avatar">
        <img src="../../assets/avatar-default.jpg" />
        <div class="account-name">极客恰恰</div>
        <div class="account-sign">极客签名,持续学习</div>
      </div> -->
    <div class="account-detail">
      <el-descriptions class="detail" :column="1" :size="size">
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-user"></i>
            用户名:
          </template>
          {{userInfo.username}}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from "vue";
import { ref } from "@vue/reactivity";
import store from "@/store";
const userInfo = computed(() => store.state.app.userInfo);
const emit = defineEmits("closeModal");

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});
const dialogTableVisible = ref(true);
const close = () => {
  emit("closeModal");
};
</script>
<style lang="scss" scoped>
.account-detail {
  .detail {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>

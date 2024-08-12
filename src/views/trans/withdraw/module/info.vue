<template>
  <el-dialog
          v-model="props.addVisible"
          width="600px"
          @close="emit('closeModal')"
          title="扣款信息"
  >
    <div v-loading="loading" class="new">
      <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="right"
              label-width="150px"
      >
        <el-form-item label="账号：" prop="account">
          <el-input v-model="form.account" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="扣款金额(元)" prop="money">
          <el-input v-model="form.money" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="explain">
          <el-input v-model="form.explain" disabled placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="扣款凭证图片：" prop="image">
          <el-image :src="form.image" fit="fill" />
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive } from "@vue/reactivity";
  import { getCurrentInstance, watch } from "@vue/runtime-core";
  import { ElMessage } from "element-plus";
  import { Plus } from "@element-plus/icons-vue";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  console.log(getCurrentInstance().appContext.config.globalProperties);
  const emit = defineEmits("closeModal");
  const props = defineProps({
    addVisible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: {},
    },
  });

  const addLoading = ref(false);
  const addVisible = ref(true);
  const rules = {};

  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    id: "",
    account: "",
    money: "",
    explain: "",
    image: "",
  });

  watch(
          () => props.info,
          (val) => {
            console.log("editInfo", val);
            let { id, account, money, explain, image} = val;
            form.id = id;
            form.account = account;
            form.money = money;
            form.explain = explain;
            form.image = image;
          },
          {
            immediate: true,
            deep: true,
          },
  );

</script>
<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    border: 1px dashed #8c939d;
    border-radius: 6px;
  }
  .avatar {
    width: 178px;
    height: 178px;
  }

</style>

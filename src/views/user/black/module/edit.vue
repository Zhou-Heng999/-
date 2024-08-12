<template>
  <el-dialog
      v-model="props.addVisible"
      width="500px"
      @close="emit('closeModal')"
      title="编辑黑名单"
  >
    <div v-loading="loading" class="new">
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="right"
          label-width="100px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="form.real_name" ></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="card_no">
          <el-input v-model="form.card_no" ></el-input>
        </el-form-item>
        <el-row class="flex-center" style="margin-top: 75px;">
          <el-button type="primary" :loading="addLoading" @click="submitForm()">
            <i class="fa fa-plus"> </i> 修改
          </el-button>
        </el-row>
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
  });

  const addVisible = ref(true);
  const editLoading = ref(false);
  const rules = {
    phone: [{ required: true, message: "请输入", trigger: "blur" }],
    real_name: [{ required: true, message: "请输入", trigger: "blur" }],
    card_no: [{ required: true, message: "请输入", trigger: "blur" }],
  };

  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    phone: "",
    real_name: "",
    card_no: "",
  });

  watch(
      () => props.info,
      (val) => {
        console.log("editInfo", val);
        let { phone, real_name, card_no} = val;
        form.phone = phone;
        form.real_name = real_name;
        form.card_no = card_no;
      },
      {
        immediate: true,
        deep: true,
      },
  );

  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        editLoading.value = true;
        $api.users
            .editBlack(form)
            .then((res) => {
              if (res.result) {
                ElMessage({
                  type: "success",
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
</style>

<template>
  <el-dialog
    v-model="props.visible"
    top="10vh"
    @close="emit('closeModal')"
    :title="$t('722')"
  >
    <div class="flex">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="116"
        inline
      >
        <el-form-item :label="$t('842')" prop="username">
          <el-input
            style="width: 195px"
            v-model="form.username"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('13')" prop="password">
          <el-input
            style="width: 195px"
            type="password"
            v-model="form.password"
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm">
        {{ $t("722") }}
      </el-button>
    </div>

    <table-modal
      ref="tableRef"
      :tableHeader="amountColumn"
      tableType="ease"
      height="auto"
      :title="$t('843')"
      tableUrl="login.sign_list"
    >
      <template #default="scope">
        <slot v-if="scope.row && scope.row.key == 'edit_row'">
          <el-space>
            <!-- v-if="scope.row.working_type==5" -->
            <el-button
              size="small"
              @click="sign_out(scope.row.user_name)"
              type="success"
              >{{ $t("844") }}</el-button
            >
          </el-space>
        </slot>
      </template>
    </table-modal>
  </el-dialog>
</template>

<script setup>
import i18n from "@/locales/index";
import { computed, onMounted } from "vue";

import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import mixins from "@/mixins/list";

const t = i18n.global.t;

const { getAccountOptions, getWorkingOptions, getChangMianOptions } = mixins();

const { proxy } = getCurrentInstance();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  visible: {
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
  username: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
};
const tableRef = ref(null);

const up = () => {
  proxy.$refs["tableRef"].getTableList();
};

const amountColumn = [
  //   { title: "电脑名称", key: "opt_type" },
  { title: "845", key: "user_name" },
  { title: "846", key: "nick" },
  { title: "847", key: "role" },
  { title: "848", key: "sign_time", width: 170 },
  { title: "4", key: "edit_row", width: 170 },
];

const formRef = ref();
const form = reactive({
  username: "",
  password: "",
});
// 签到
const sign = () => {
  $api.login.sign(form).then((res) => {
    ElMessage({
      type: "success",
      showClose: true,
      message: t("849"),
    });
    up();
  });
};

const sign_out = (account) => {
  $api.login.sign_out({ account }).then((res) => {
    ElMessage({
      type: "success",
      showClose: true,
      message: t("850"),
    });
    up();
  });
};

onMounted(() => {
  // getAccountOptions();
  // getWorkingOptions();
  // getChangMianOptions();
});

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;
      sign();
    }
  });
};
</script>
<style lang="scss" scoped></style>

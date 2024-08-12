<template>
  <el-dialog
    v-model="props.addVisible"
    width="60vw"
    @close="emit('closeModal')"
    :title="$t('556')"
  >
    <div class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="150px"
      >
        <el-form-item :label="$t('550')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('551')" prop="type">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item :label="$t('319')" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="item.value" v-for="item in statusList" border>{{
              item.label
            }}</el-radio>
          </el-radio-group>
          <!-- <el-tag color="#f56c6c" style="color: #fff">Tag 1</el-tag> -->
        </el-form-item>
        <el-form-item :label="$t('557')" prop="itemList">
          <el-space direction="vertical">
            <el-space v-for="(item, index) in form.itemList" :key="item.key">
              <el-input v-model="item.name" :placeholder="$t('558')"></el-input>
              <el-input v-model="item.key" :placeholder="$t('559')"></el-input>
              <el-select v-model="item.color" :placeholder="$t('560')">
                <el-option
                  v-for="item in colorList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="item.remark"
                :placeholder="$t('备注')"
              ></el-input>

              <el-input v-model="item.lan" :placeholder="$t('561')"></el-input>
              <el-select v-model="item.status" :placeholder="$t('319')">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-button :icon="Plus" @click="addItem" />
              <el-button :icon="Minus" @click="deleItem(index)" />
            </el-space>
          </el-space>
        </el-form-item>
        <el-form-item :label="$t('95')" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>

        <el-row class="flex-center" style="margin-top: 50px">
          <el-button type="primary" :loading="addLoading" @click="submitForm()">
            <i class="fa fa-plus"> </i> {{ $t("lang.131") }}
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import i18n from "@/locales/index";
import { computed } from "vue";

import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus, Minus } from "@element-plus/icons-vue";

const t = i18n.global.t;

const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "",
  },
  info: {
    type: Object || null,
    default: null,
  },
});
const statusList = [
  { label: t("555"), value: "1" },
  { label: t("554"), value: "0" },
];
const colorList = [
  { label: t("562"), value: "" },
  { label: t("563"), value: "success" },
  { label: t("564"), value: "info" },
  { label: t("565"), value: "warning" },
  { label: t("566"), value: "danger" },
];
const addLoading = ref(false);
const rules = {
  name: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
  status: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
  use_time: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
  itemList: [
    {
      required: true,
      message: computed(() => t("lang.132")).value,
      trigger: "blur",
    },
  ],
};

const formRef = ref();
const form = reactive({
  name: "",
  type: "",
  status: "1",
  itemList: [
    { name: "", key: "", color: "", lan: "", status: "1", remark: "" },
  ],
  remark: "",
});
watch(
  () => props.type,
  (val) => {
    if (val == "update") {
      for (let i in form) {
        form[i] = props.info[i];
      }
      form.status = `${form.status}`;
    }
  }
);

// 添加子项
const addItem = () => {
  form.itemList.push({ name: "", key: "", color: "", lan: "", status: "1" });
};
// 删除子项
const deleItem = (index) => {
  form.itemList.splice(index, 1);
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let newForm = { ...form };
      newForm.itemList = JSON.stringify(newForm.itemList);
      newForm.status = Number(newForm.status);
      if (props.type == "update") newForm.id = props.info.id;
      $api.dictionary[props.type](newForm)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: t("lang.97"),
            });
            emit("closeModal");
            emit("updateList");
            // formRef.value.
          }
        })
        .finally(() => {
          addLoading.value = false;
        });
    }
  });
};
</script>
<style lang="scss" scoped>
.form_row {
  width: 120px;
  margin-right: 10px;
}
</style>

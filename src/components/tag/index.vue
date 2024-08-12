<template>
  <el-tag :type="getTagData('color')">
    {{ getTagData("name") }}
  </el-tag>
</template>
<script setup>
import i18n from "@/locales/index";
import { reactive, ref } from "@vue/reactivity";
import { formContextKey } from "element-plus";
import { computed } from "vue";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { useRouter } from "vue-router";

const t = i18n.global.t;

const router = useRouter();

const { $api, $getTypeOption } =
  getCurrentInstance().appContext.config.globalProperties;

const emit = defineEmits("toLogin");
const props = defineProps({
  type: {
    type: Boolean,
    default: "",
  },
  name: {
    type: Boolean,
    default: "",
  },
});
const getTagData = (type) => {
  try {
    return $getTypeOption(props.type, "type")[props.name][type];
  } catch (error) {
    return props.name;
  }
};
</script>
<style lang="scss" scoped></style>

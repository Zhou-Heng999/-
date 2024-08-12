<template>
  <div
    ref="searchRef"
    :class="[
      'search-bar',
      props.isBottom ? 'flex-column flex-align' : 'flex-align',
    ]"
  >
    <el-form
      ref="formRef"
      :class="[$isPhone ? 'flex mr10' : 'flex']"
      :model="valueForm"
      :inline="$isPhone ? false : true"
      label-width="80px"
    >
      <el-form-item
        :label="item.label ? $t(item.label) : item.label"
        :prop="item.key"
        v-for="(item, index) in isShowAll ? formConfig.formItemList : lessList"
        :key="item.key"
        class="mt10"
      >
        <!-- 输入框 -->
        <el-input
          :placeholder="item.placeholder ? $t(item.placeholder) : ''"
          v-model="valueForm[item.key]"
          :type="item.subtype"
          clearable
          :style="`width: ${item.width ?? 100}px`"
          v-if="item.type === 'input'"
        />

        <div v-if="item.type === 'inputList'">
          <el-space>
            <div class="flex-align" v-for="(p, pindex) in item.list">
              <el-input
                :placeholder="p.placeholder ? $t(p.placeholder) : ''"
                v-model="valueForm[p.key]"
                :type="p.subtype"
                clearable
                :style="`width: ${p.width ?? 100}px`"
              />
              <span class="ml10" v-if="pindex < item.list.length - 1">~</span>
            </div>
          </el-space>
        </div>

        <!-- 搜索框 -->
        <el-input
          :placeholder="item.placeholder"
          v-model="valueForm[item.key]"
          clearable
          :type="item.subtype"
          :style="`width: ${item.width ?? 100}px`"
          v-if="item.type === 'search'"
          :prefix-icon="Search"
          @input="searchInput"
        />

        <!-- 下拉选择框 -->

        <template v-if="item.type === 'select' && !item.optType">
          <el-select
            :placeholder="item.placeholder ? $t(item.placeholder) : $t('200136')"
            v-model="valueForm[item.key]"
            :style="`width: ${item.width ?? 100}px`"
            filterable
            clearable
            allow-create
            :disabled="item.disabled"
            :options="
              item.storeList
                ? store.state.app[item.storeList]
                : item.optType
                ? getOptionList(item.optType)
                : item.options
            "
          >
            <el-option
              v-for="(u, uindex) in item.storeList
                ? store.state.app[item.storeList]
                : item.options"
              :key="uindex"
              :label="u.label"
              :value="u.value"
            />
          </el-select>
        </template>

        <!-- 下拉选择框 -->
        <el-select
          :placeholder="item.placeholder ? $t(item.placeholder) : $t('200136')"
          v-model="valueForm[item.key]"
          v-if="item.type === 'select' && item.optType"
          value-key="name"
          filterable
          clearable
          :style="`width: ${item.width ?? 100}px`"
          :disabled="item.disabled"
        >
          <el-option
            :value="u.value"
            v-for="(u, index) in getOptionList(item.optType)"
            :key="index"
            :label="u.label"
          ></el-option>
        </el-select>

        <!-- 时间选择器 某日 或者某月某年 -->

        <el-date-picker
          v-model="valueForm[item.key]"
          v-if="item.type === 'date'"
          :style="`width: ${item.width ?? 150}px`"
          :type="item.pickerType ? item.pickerType : 'date'"
          placeholder="Pick a day"
          value-format="x"
        />

        <!-- 时间区间 年月日-->

        <el-date-picker
          :style="`width: ${item.width ?? 300}px`"
          v-model="valueForm[item.key]"
          v-if="item.type === 'daterange'"
          type="daterange"
          unlink-panels
          range-separator="To"
          :start-placeholder="item.placeholder[0]"
          :end-placeholder="item.placeholder[1]"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="x"
        />

        <!-- 时间区间 年月日 时分秒-->

        <el-date-picker
          :style="`width: ${item.width ?? 300}px`"
          v-model="valueForm[item.key]"
          v-if="item.type === 'datetimerange'"
          format="YYYY/MM/DD HH:mm:ss"
          type="datetimerange"
          @change="changeTime"
          unlink-panels
          range-separator="To"
          :start-placeholder="item.placeholder[0]"
          :end-placeholder="item.placeholder[1]"
          value-format="x"
        />
      </el-form-item>
    </el-form>
    <el-icon
      v-if="showLen != 0 && !$isPhone"
      @click="isShowAll = !isShowAll"
      class="mr20 ml10"
    >
      <ArrowUpBold v-if="isShowAll" />
      <ArrowDownBold v-else
    /></el-icon>
    <div class="flex-align mt10" v-if="!formConfig.openCustomBtn">
      <el-button type="primary" @click="handleSubmit">搜索</el-button>
      <el-button
        v-if="isShowResetBtn"
        class="ml10 my-btn-default"
        @click="handleReset"
        >重置</el-button
      >
      <el-button
        type="primary"
        v-if="isShowExcel"
        @click="exportExcel(column, valueForm, tableUrl)"
        :loading="state.setting.isExcelLoading"
      >
        {{ state.setting.isExcelLoading ? $t("481") : $t("200462") }}
      </el-button>
    </div>
    <div v-else>
      <slot name="customBtn" />
    </div>
  </div>
</template>

<script setup>
import i18n from "@/locales/index";
import { onMounted } from "vue";
import { ref } from "@vue/reactivity";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { Search, ArrowDownBold, ArrowUpBold } from "@element-plus/icons-vue";
import { getCurrentInstance } from "vue";
import dayjs from "dayjs";
const t = i18n.global.t;

let { state } = store;

const { exportExcel } = mixin();
const emit = defineEmits("handleSearch", "searchReset");
const { $api, $getTypeOption, $isPhone } =
  getCurrentInstance().appContext.config.globalProperties;
const setTime = (time, ty = "YYYY-MM-DD HH:mm:ss") => {
  if (time == 0) {
    return "";
  }
  if (typeof time == "string") return time;
  return dayjs.unix(time).format(ty);
};
const props = defineProps({
  isShowResetBtn: {
    type: Boolean,
    default: true,
  },
  isBottom: {
    type: Boolean,
    default: false,
  },
  formConfig: {
    type: Object,
    default: {},
  },
  valueForm: {
    type: Object,
    default: {},
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  column: {
    type: Array,
    default: () => [],
  },
  tableUrl: {
    type: String,
    default: "",
  },
  isShowExcel: {
    type: true,
    default: Boolean,
  },
});

const formRef = ref(null);
// 查询
const handleSubmit = () => {
  emit("handleSearch", props.valueForm);
};
// 重置
const handleReset = () => {
  formRef.value.resetFields();
  emit("handleReset", formRef.value);
};

const getOptionList = (type) => {
  let list = $getTypeOption(type);
  list = [{ value: "", label: t("196") }, ...list];
  return list;
};
const changeTime = (val) => {
  console.log(val);
};

let searchTime = null;
const searchInput = (val) => {
  if (searchTime) clearTimeout(searchTime);
  searchTime = setTimeout(() => {
    emit("handleSearch", props.valueForm);
  }, 500);
};
const getOptUrlList = async (url) => {
  let httpArr = url.split(".");
  let obj = await $api[httpArr[0]][httpArr[1]]();
  let { data } = obj;

  return data;
};
const searchRef = ref(0);
const showLen = ref(null);
const isShowAll = ref(true);
let lessList = ref([]);
onMounted(() => {
  let { formItemList } = props.formConfig;
  let view = searchRef.value.children[0];
  let childWidth = 0;
  let Len = 0;
  let little;
  formItemList.forEach(async (item, index) => {
    if (item.type == "select" && item.url) {
      item.options = await getOptUrlList(item.url);
    }
    if (item.storeList) {
      item.options = store.state.app[item.storeList];
    }
    childWidth += view.children[index].offsetWidth + 32;
    Len += childWidth > view.offsetWidth ? 1 : 0;
    item.isHide = childWidth > view.offsetWidth ? true : false;
  });
  // if ($isPhone) props.formConfig.formItemList = formItemList[0];
  if (!$isPhone) {
    lessList.value = formItemList.filter((item) => !item.isHide);
    showLen.value = Len;
    isShowAll.value = false;
  }
});
</script>
<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0;
}
.search-bar {
  display: flex;
  box-sizing: border-box;
  justify-content: flex-end;
}
.scroll-view {
  display: flex;
  overflow: scroll;
  padding-right: 10px;
  margin-top: 10px;
}
.mt20 {
  margin-top: 20px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
</style>

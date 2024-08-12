<template>
  <el-config-provider :locale="zhCn">
    <router-view v-if="isRouteActive" />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { getCurrentInstance, provide, ref, nextTick } from "vue";
import { onMounted, computed } from "@vue/runtime-core";
import store from "@/store";
import mixins from "@/mixins/list";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const {
  getAccountOptions,
  getWorkingOptions,
  getChangMianOptions,
  getRechargeOptions,
  getDesks,
} = mixins();
const { locale, t, mergeLocaleMessage, setLocaleMessage } = useI18n();
const isRouteActive = ref(true);
provide("reload", () => {
  isRouteActive.value = false;
  nextTick(() => {
    isRouteActive.value = true;
  });
});

const getUrl = () => {
  // 获取当前页面的 URL
  const url = window.location.href;
  console.log("url", url);

  // 创建 URL 对象
  const urlObject = new URL(url);
  console.log("urlObject", urlObject);
  if (urlObject.search.includes("token")) {
    // const matches = urlObject.href.match(/token=([^#]+)/);
    // if (matches && matches.length > 1) {
    //   console.log('token',matches[1]);
    // }
    const searchParams = new URLSearchParams(urlObject.search);
    const tokena = searchParams.get("token");
    const userInfoa = searchParams.get("userInfo");

    const token = atob(tokena);
    const userInfo = atob(userInfoa);
    console.log("token", token); // 输出参数值：
    console.log("userInfo", userInfo); // 输出参数值：
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", userInfo);
    // 跳转到指定页面
    window.location.href = urlObject.origin + urlObject.pathname
    
  } else {
    console.log('字符串中不包含 "token" 字样');
  }
};

const getDic = () => {
  $api.dictionary
    .list({
      page: 1,
      size: 300,
    })
    .then((res) => {
      // let list = res.data
      if (res && res.result) {
        let list = res.data.list;
        store.commit("app/setTypeList", list);
      }
    });
};
const getCur = () => {
  $api.channel.cur().then((res) => {
    console.log(res);
    store.commit("app/setCurData", res.data.name);
    document.title = res.data.name   + " IM管理后台";
  });
};

onMounted(() => {
  getUrl();
  getDic();
  getCur();
  locale.value = store.state.setting.language;
});
</script>
<style lang="scss" scoped></style>

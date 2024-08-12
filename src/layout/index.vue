<template>
  <!-- <el-affix :offset="0"> -->
    <div class="sidebar-container" v-if="menuPosition=='left'">
      <Sidebar  />

    </div>
    <div :class="[menuPosition=='left'? 'main-container':'']">
      <navbar :primary="primary" />
      <AppMain />
    </div>
  <!-- </el-affix> -->
  <!-- <div class="pd-lr-10 pd-tb-20 mian">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div> -->
</template>

<script setup>
import store from "@/store/index";

import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar/index.vue";
import AppMain from "./components/AppMain.vue";
import { useRoute } from "vue-router";
import { computed, onMounted, getCurrentInstance, ref, watch } from "vue";
const menuPosition = computed(() => store.state.app.menuPosition);
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const route = useRoute();
</script>
<style lang="scss" scoped>
@import "@/assets/style/mixin.scss";
@import "@/assets/style/variables.scss";
.pd-lr-10 {
  padding-left: 10px;
  padding-right: 10px;
}
.mian {
  position: relative;
  height: calc(100% - 150px);
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.hide-header {
  display: none;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 63px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>

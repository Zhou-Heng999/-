<template>
  <div :class="{ 'has-logo': showLogo }">

    <div v-if="menuPosition=='left'" style="height:100vh">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :router="true"
          :unique-opened="false"
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="selectItem"
        >
          <!--递归路由对象-->
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
    </el-scrollbar>
    </div>

    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
    <el-menu
      v-else
      :mode="$isPhone ? 'vertical' : 'horizontal'"
      :router="true"
      :unique-opened="false"
      :default-active="activeMenu"
      class="el-menu-vertical"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="selectItem"
    >
      <!--递归路由对象-->
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import sidebarItem from "@/layout/components/Sidebar/sidebarItem.vue";
import { ref, computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import store from "@/store";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
const { $isPhone } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits(["checkMenu"]);
const menuPosition = computed(() => store.state.app.menuPosition);
const routes = computed(() => store.state.app.menu);
const route = useRoute();
const isCollapse = ref(false);
const showLogo = ref(false);
const activeMenu = computed(() => {
  return route.path;
});
const selectItem = () => {
  emit("checkMenu");
};
</script>
<style lang="scss" scoped></style>

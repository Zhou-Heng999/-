<template>
  <div class="flex-between tabs-view flex-align">
    <div class="tabs-left">
      <el-tabs
        v-model="tabsValue"
        type="card"
        @tab-click="tabClick"
        :closable="tabsValue == '/home' ? false : true"
        @tab-remove="removeTab"
        style="background: #fff"
      >
        <el-tab-pane
          v-for="item in routeList"
          :key="item.path"
          :name="item.path"
        >
          <template #label>
            <el-space>
              <!-- 多语言 -->
              <!-- <span v-if="item.name">{{ $t("menus." + item.name) }}</span>
              <span v-else>{{ item.title }}</span> -->
              
              <!-- 中文 -->
              <span>{{ item.title }}</span>

              <el-icon
                :class="[isUpPage ? 'go' : '']"
                v-if="item.path == tabsValue"
                @click="updatePage"
                ><RefreshRight
              /></el-icon>
            </el-space>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="flex-center clear-view">
      <el-tooltip content="一键关闭" placement="top-start">
        <el-icon @click="removeAll"><CircleClose /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import store from "@/store/index";
import {
  RefreshRight,
  Setting,
  Document,
  Back,
  Right,
  CircleClose,
} from "@element-plus/icons-vue";
const router = useRouter();
const route = useRoute();
const routeList = computed(() => store.state.app.routeList);
const tabsValue = computed(() => router.currentRoute.value.fullPath);
const tabClick = (pane) => {
  router.push(pane.paneName);
};
const reload = inject("reload");
const isUpPage = ref(false);
const updatePage = () => {
  // isUpPage.value = true;
  // setTimeout(() => {
  // }, 0);
  reload();
};
const handleTabsEdit = (targetName, action) => {
  let len = routeList.value.length;

  if (action === "remove") {
    let index = routeList.value.findIndex((item) => item.path == targetName);
    let { path } = routeList.value[index];
    routeList.value.splice(index, 1);
    // localStorage.setItem("routeList", JSON.stringify(routeList.value));
    store.commit("app/setRouteList", routeList.value);
    if (len > 1 && path == tabsValue.value) {
      router.push(routeList.value[index].path);
    } else {
      router.push(routeList.value[index].path);
    }
  }
};
const removeAll = () => {
  let newArr = routeList.value.filter((item) => item.path == "/home");

  store.commit("app/setRouteList", newArr);
  router.push("/home");
};
const removeTab = (e) => {
  console.log(e);
  let len = routeList.value.length;

  let index = routeList.value.findIndex((item) => item.path == e);
  console.log(routeList.value, index);
  // return;
  let { path } = routeList.value[index];
  routeList.value.splice(index, 1);
  if (len > 1 && path == tabsValue.value) {
    if (index == len - 1) {
      router.push(routeList.value[index - 1].path);
    } else {
      router.push(routeList.value[index].path);
    }
  } else {
    if (routeList.value[index]) {
      router.push(routeList.value[index].path);
    }
  }
};
</script>
<style lang="scss" scoped>
.aa {
  transition: all 2s;
}

.go {
  animation: spin 3s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(720deg);
  }
}
.clear-view {
  width: 50px;
  height: 50px;
}
.tabs-view {
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 10px;
}
.tabs-left {
  width: calc(100vw - 50px);
}
::v-deep(.el-tabs__header) {
  margin-bottom: 0 !important;
}
::v-deep(.el-tabs--card > .el-tabs__header) {
  border-bottom: none;
}
</style>

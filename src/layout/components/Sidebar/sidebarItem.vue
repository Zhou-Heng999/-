<template>
  <div class="menu-wrapper">
    <!--only on child show el-menu -->
    <template v-if="!item.children">
      <el-menu-item :key="item.path" :index="item.path" :route="item.path">
        <template #title>{{ item.meta.title }}</template>
        <!-- {{ $t("menus." + item.name) }} -->
      </el-menu-item>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="item.path">
      <template #title>
        <!-- <i :data-index="item.path"></i> -->
        <span>{{ item.meta.title }}</span>
        <!-- {{ $t("menus." + item.name) }} -->
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="child.path"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>
<script setup>
import { onMounted, ref, toRef, computed } from "vue";
import { useStore } from "vuex";
const emit = defineEmits(["checkMenu"]);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isNested: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: "",
  },
});
const onlyOneChild = ref();
// const hasOneShowingChild = (children, parent) => {
//   // RouteRecordRaw 只能在meta中配置额外属性，过滤是否展示路由；
//   if (!children) {
//     return false;
//   }
//   // if (children) {
//   const showingChildren = children.filter((item) => {
//     // 如果meta 配置隐藏该路由，则返回false;

//     if (item?.meta?.hidden) {
//       return false;
//     }
//     //
//     onlyOneChild.value = item;
//     return true;
//   });

//   // 判断当前路由，是否有孩子children，以及孩子个数；
//   if (showingChildren.length === 1) {
//     return true;
//   }

//   // 如果没有孩子，则展示父级路由；
//   if (showingChildren.length === 0) {
//     onlyOneChild.value = { ...parent, noShowingChildren: true };
//     return true;
//   }

//   return false;
// };
</script>
<style lang="stylus" scoped></style>

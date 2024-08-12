<template>
  <div class="main-view">
    <div class="pd-lr-10 pd-tb-20">
      <tabs-modal></tabs-modal>
    </div>
    
    <div class="pd-lr-10 pd-tb-20 mian">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import store from "@/store/index";
import { useRouter, useRoute } from "vue-router";

import tabsModal from "@/components/tabs/index.vue";
</script>
<style lang="scss" scoped>
.main-view {
  padding-top: 15px;
  box-sizing: border-box;
  background: #fff;
}
.pd-lr-10 {
  padding-left: 10px;
  padding-right: 10px;
}
</style>

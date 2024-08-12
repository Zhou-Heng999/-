/* eslint-disable max-len */
<template>
  <div @click="toggleClick">
    <i
      :class="[
        isActive ? 'is-active' : '',
        'hamburger iconfont icon-yonghuguanli',
      ]"
    ></i>
  </div>
</template>
<script setup>
const toggleClick = () => {
  emit("toggleClick");
};
</script>
<style lang="scss" scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>

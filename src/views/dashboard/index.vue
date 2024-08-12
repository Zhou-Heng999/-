<template>
  <div class="home-view" v-if="!$isPhone">
    <el-image class="img1" :src="image1" />
    <el-image class="img2" :src="image2" />
    <el-image class="img3" :src="image3" />
    <span class="home-test">Hi!</span>
    <!-- <span class="home-test">Hi, dear guest!</span> -->
  </div>
  <div class="home-view flex-center flex-column" v-if="$isPhone">
    <!-- <el-image class="img_phone1" :src="image1" />
    <el-image class="img_phone2" :src="image2" /> -->

    <!-- 开户 -->
    <div class="max-width mb20 title-text">
      <span class="ml20">{{ $t("200336") }}</span>
    </div>

    <div class="flex-wrap max-width t-view mb20">
      <div
        class="flex-column flex-center menu-item"
        @click="() => $router.push(item.path)"
        v-for="item in peopleArr"
      >
        <el-image
          class="mb10"
          style="width: 40px; height: 40px"
          :src="getAssetsFile(item.iconUrl)"
        />
        <span>{{ $t("menus." + item.name) }}</span>
      </div>
    </div>

    <div class="max-width mb20 title-text">
      <span class="ml20">{{ $t("885") }}</span>
    </div>

    <div class="flex-wrap max-width t-view mb20">
      <div
        class="flex-column flex-center menu-item"
        @click="() => $router.push(item.path)"
        v-for="item in topArr"
      >
        <el-image
          class="mb10"
          style="width: 40px; height: 40px"
          :src="getAssetsFile(item.iconUrl)"
        />
        <span>{{ $t("menus." + item.name) }}</span>
      </div>
    </div>
    <div class="max-width mb20 title-text">
      <span class="ml20">{{ $t("886") }}</span>
    </div>

    <div class="flex-wrap max-width t-view">
      <div
        class="flex-column flex-center menu-item"
        @click="() => $router.push(item.path)"
        v-for="item in menuList"
      >
        <el-image
          class="mb10"
          style="width: 40px; height: 40px"
          :src="getAssetsFile(item.iconUrl)"
        />
        <span>{{ $t("menus." + item.name) }}</span>
      </div>
    </div>
    <!-- <el-image class="img_phone3" :src="image3" /> -->
    <!-- <span class="phone-test">Hi, dear guest!</span> -->
  </div>

  <!-- <div class="pc_home"></div> -->
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import image1 from "@/assets/images/zs_1.png";
import image2 from "@/assets/images/zs_2.png";
import image3 from "@/assets/images/zs_3.png";
import mixins from "@/mixins/list";
import store from "@/store";
const topList = [
  { url: "/desk/work", iconUrl: "kglb" },
  // { url: "/commission/day", iconUrl: "yjjj" },
  { url: "/scene/safe", iconUrl: "bx" },
  // { url: "/commission/log", iconUrl: "jsrz" },
  { url: "/scene/safeturnover", iconUrl: "bxls" },
  { url: "/commission/dayMas", iconUrl: "yjjj" },
  { url: "/commission/logMas", iconUrl: "jsrz" },
  { url: "/accountant/buyCode", iconUrl: "mm" },
  { url: "/accountant/accountTableMas", iconUrl: "sj" },
  { url: "/accountant/truncationMas", iconUrl: "jgjl" },
];
const urlList = [
  { url: "/consume/new", iconUrl: "xzxf" },
  { url: "/consume/history", iconUrl: "xfjl" },
  { url: "/consume/transfer", iconUrl: "xfgz" },
];
const peopleList = [
  { url: "/account/accountList", iconUrl: "khlb" },
  { url: "/deposit/depositCard", iconUrl: "ckgl" },
  { url: "/deposit/cardTurnover", iconUrl: "ckls" },
];
const getAssetsFile = (url) => {
  return new URL(`../../assets/images/${url}.png`, import.meta.url).href;
};
const menuList = ref([]);
const topArr = ref([]);
const peopleArr = ref([]);
onMounted(() => {
  let menuArr = store.state.app.menu;
  menuArr.forEach((item) => {
    if (item.children) {
      item.children.map((c) => {
        let t = urlList.findIndex((f) => f.url == c.path);
        let top = topList.findIndex((f) => f.url == c.path);

        let pIndex = peopleList.findIndex((f) => f.url == c.path);
        if (t != -1) {
          menuList.value.push({ ...c, iconUrl: urlList[t].iconUrl });
        }
        if (top != -1) {
          console.log(c.path);
          topArr.value.push({ ...c, iconUrl: topList[top].iconUrl });
        }
        if (pIndex != -1) {
          peopleArr.value.push({ ...c, iconUrl: peopleList[pIndex].iconUrl });
        }
      });
    }
  });
});
</script>

<style lang="scss" scoped>
.pc_home {
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
}
.t-view {
  width: 100%;
  /* min-height: 120px; */
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.06);
}
.menu-item {
  width: 25%;
  margin-bottom: 10px;
  color: #a9a9a9;
}
.title-text {
  color: #a9a9a9;
}
.home-view {
  height: 90vh;
  width: 100%;
  position: relative;
}
.img1 {
  position: absolute;
  right: 0;
  bottom: 10vh;
  width: 751px;
  height: 357px;
}
.img2 {
  position: absolute;
  right: 0;
  top: 0;
  width: 271px;
  height: 171px;
}
.img3 {
  position: absolute;
  left: 0;
  top: 15vh;
  width: 982px;
  height: 747px;
}
.home-test {
  position: absolute;
  right: 10vw;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 46px;
  font-weight: bold;
}
.img_phone1 {
  width: 109px;
  height: 55px;
  position: absolute;
  bottom: 510px;
  right: 0;
}
.img_phone3 {
  width: 100%;
  height: 300px;
  position: absolute;
  bottom: 0;
  left: 0;
}
.img_phone2 {
  width: 110px;
  height: 51px;
  position: absolute;
  top: 0;
  left: 0;
}
.phone-test {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
}
</style>

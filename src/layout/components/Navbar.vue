<template>
  <div :class="['navbar', menuPosition == 'left'? '':'top-bg']">
    <el-header class="flex">
      <el-row class="flex-between" style="width: 100%">
        <el-col v-if="!$isPhone" :span="19">
          <breadcrumb v-if="menuPosition == 'left'" class="breadcrumb-container" />
          <Sidebar v-else />
         
        </el-col>
        <el-col class="flex-center" :span="2" v-if="$isPhone">
          <!-- <el-dropdown @command="(path) => $router.push(path)">
            <el-icon ref="buttonRef" color="#fff" size="22"><Menu /></el-icon>

            <template #dropdown>
              <el-dropdown-item :command="item.path" v-for="item in menuList">
                {{ $t("menus." + item.name) }}
              </el-dropdown-item>
            </template>
          </el-dropdown> -->
          <el-popover
            v-if="isShowAllList"
            ref="popoverRef"
            :virtual-ref="buttonRef"
            trigger="click"
            virtual-triggering
            style="padding: 0"
          >
            <Sidebar @checkMenu="onClickOutside" />
          </el-popover>
          <!-- <Sidebar /> -->
        </el-col>
        
        <el-col
          style="display: flex; justify-content: flex-end"
          :span="5"
          :xs="22"
        >
          <el-space>
            <!-- <el-dropdown @command="changeLang" class="Language">
              <p v-if="menuPosition=='left'" class="language-view flex-center">
                {{ $t("common.language") }}
              </p>
              <p v-else class="language-view w-color flex-center">
                {{ $t("common.language") }}
              </p>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :command="item.tag"
                    v-for="item in langOptions"
                    >{{ item.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
              <div style="font-size: 15px; ">
              <span  style="font-size: 15px; margin:12px 0px 0 10px">{{curData}}管理后台</span>
            </div>
            <el-dropdown
              @command="handleCommand"
              class="avatar-container"
              trigger="hover"
            >
            
              <div class="flex-align">
                <el-avatar :size="24" :icon="UserFilled"></el-avatar>
                <div class="ml10 w-color">{{ userInfo.nick }}</div>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                  <el-dropdown-item command="personal"
                    >个人信息</el-dropdown-item
                  >
                  <el-dropdown-item command="changePassword">
                    修改密码
                  </el-dropdown-item>

                  <el-dropdown-item divided command="loginOut"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </el-col>
      </el-row>
    </el-header>
    <personal
      :dialogVisible="isPersonalShow"
      @closeModal="isPersonalShow = false"
    />
  </div>
  <resetPassword
    :dialogVisible="isPasswordShow"
    @closeModal="isPasswordShow = false"
  />
  <verification
    :dialogVisible="isVerificationShow"
    @closeModal="isVerificationShow = false"
  />
  <sign :visible="isSign" @closeModal="isSign = false"></sign>
</template>

<script setup>
import Sidebar from "../components/Sidebar/index.vue";

import {
  computed,
  onMounted,
  getCurrentInstance,
  ref,
  watch,
  unref,
  onActivated,
} from "vue";
import personal from "@/components/personal/index.vue";
import resetPassword from "@/components/resetPassword/index.vue";
import verification from "@/components/verification/index.vue";
import Breadcrumb from "../../components/Breadcrumb/index.vue";
import sign from "@/components/sign/index.vue";
import lanq from "@/locales/lan.json";
import { ClickOutside as vClickOutside } from "element-plus";
import store from "@/store";
import { UserFilled, Menu } from "@element-plus/icons-vue";
import Hamburger from "@/components/Hamburger/index.vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import mixins from "@/mixins/list";
const { locale, t, mergeLocaleMessage, getLocaleMessage, setLocaleMessage } =
  useI18n();
const isShowModal = ref(false);
const router = useRouter();
const isPersonalShow = ref(false);
const isPasswordShow = ref(false);
const isVerificationShow = ref(false);
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const opened = ref(true);
const avatar = ref("");
const messageNum = ref(0);
const toggleSideBar = () => {};
const userInfo = computed(() => store.state.app.userInfo);
const menuPosition = computed(() => store.state.app.menuPosition);
const curData = computed(() => store.state.app.curData);
const hallId = ref("");
const hallOptions = ref([]);
const langOptions = ref([]);
let Language = lanq.Language;
let zh = {},
  en = {},
  zh_tw = {};
for (let i in Language) {
  zh_tw[i] = Language[i]["zh_tw"];
  en[i] = Language[i]["en"];
  zh[i] = Language[i]["zh"];
}
const buttonRef = ref();
const popoverRef = ref();
const onClickOutside = () => {
  popoverRef.value.hide();
};
const isShowAllList = ref(false);
const menuList = ref([]);
onActivated(() => {
  // getLangOptions();
});

const setHall = () => {
  let { money_unit } = store.state.app.hallInfo;
  // 匹配万
  if (money_unit == "K") {
    for (let i in zh) {
      if (zh[i].indexOf("匣万") == -1) {
        zh[i] = zh[i].replace("万", "千");
      }
      if (zh_tw[i].indexOf("匣萬") == -1) {
        zh_tw[i] = zh_tw[i].replace("萬", "千");
      }
      en[i] = en[i].replace("(W)", "(K)");
      en[i] = en[i].replace("（W）", "(K)");
    }

    mergeLocaleMessage("zh-cn", zh);
    mergeLocaleMessage("zh-tw", zh_tw);
    mergeLocaleMessage("en", en);
  }
};

const getLangOptions = () => {
  langOptions.value.length = 0;
  $api.sys.getlanguages().then((res) => {
    for (let i in res.data) {
      if (res.data[i].status == 0) {
        langOptions.value.push({
          tag: res.data[i].tag,
          name: res.data[i].name,
        });
      }
    }
  });
};

const changeHall = (val) => {
  $api.sys.changeHall({ hall_id: val }).then((res) => {
    if (res.result) {
      location.reload();
    }
  });
};

const isSign = ref(false);
const handleSign = () => {
  isSign.value = true;
};
const loginOut = () => {
  $api.login.loginOut().then((res) => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage({
      message: t("838"),
      type: "warning",
    });
    router.push({ path: "/login", replace: true });
  });
};

const handleCommand = (command) => {
  if (command == "loginOut") {
    loginOut();
  } else if (command == "personal") {
    isPersonalShow.value = true;
  } else if (command == "changePassword") {
    isPasswordShow.value = true;
  }
};

const changeLang = (command) => {
  locale.value = command;
  localStorage.setItem("language", command);
};
</script>
<style lang="scss" scoped>
.top-bg {
  background: #545c64;
}
.navbar {
  height: 56px;
  overflow: hidden;
  position: relative;
  // background: #545c64;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.28);
  z-index: 1;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .nickname {
    float: right;
    padding: 0px 25px 0px 25px;
    line-height: 40px;
    outline: none;
  }
  .language-view {
    width: 30px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }
    .right-menu-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .message-badge {
      .is-fixed {
        top: 12px !important;
        right: 28px !important;
      }
      .message {
        border: none;
        padding: 5px 20px;

        i {
          background-color: transparent;
          border: none;
          color: #2c3e50;
          font-size: 25px;
        }
      }
    }

    .full-screen {
      background-color: transparent;
      border: none;
      padding: 5px 20px;

      i {
        background-color: transparent;
        border: none;
        color: #2c3e50;
        font-size: 28px;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 1px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .Language {
      margin-right: 15px;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .select_hall {
      margin-right: 15px;
      span {
        margin-right: 8px;
        font-size: 15px;
      }
    }
  }
}
</style>

<template>
  <el-dialog
      v-model="props.dialogVisible"
      @close="close"
      width="50%"
      append-to-body
      title="谷歌验证"
  >
    <el-steps :active="stepIndex" align-center finish-status="success">
      <el-step
          v-for="(item, index) in stepList"
          :key="index"
          :title="item.title"
          :description="item.description"
      />
    </el-steps>
    <div class="content-view">
      <!-- APP下载 -->
      <div class="qrcode-view" v-if="stepIndex == 1">
        <div class="step-des"></div>
        <div class="qrcode-view-image mt10">
          <div class="flex-column flex-center">
            <span class="mb10 font-bold">android</span>
            <qrcode-vue
                v-if="pageState.androidCode"
                :value="pageState.androidCode"
                :size="255"
                level="H"
            />
          </div>

          <div class="flex-column flex-center">
            <span class="mb10 font-bold">ios</span>
            <qrcode-vue
                v-if="pageState.iosCode"
                :value="pageState.iosCode"
                :size="255"
                level="H"
            />
          </div>
        </div>
      </div>

      <!-- 扫码绑定 -->

      <div class="scan-view" v-if="stepIndex == 2">
        <qrcode-vue
            v-if="pageState.qrcode"
            :value="pageState.qrcode"
            :size="255"
            level="H"
        />
        <el-button
            type="primary"
            v-if="stepIndex != stepList.length"
            @click="changeStep('next')"
        >生成二维码</el-button
        >
      </div>
      <div class="code-view" v-if="stepIndex == 3">
        <div class="des-text">
          <p>
            要验证已经绑定的身份验证器，可在下面的输入框中输入验证器上显示的动态验证码，然后点击验证
          </p>
          <p>
            如果验证成功，身份验证器可以使用。现在你可以通过后台给你的账号、密码和手机上显示的动态验证码进行后台登录了！
          </p>
          <p>
            如果验证失败，请注意检查您的手机时间与服务器时间是否一致，如果两者时间偏差超过两分钟则无法验证通过。
          </p>
        </div>

        <el-input
            v-model.number="code"
            max="6"
            placeholder="动态验证码(六位数字)"
            class="code-view-input"
        >
          <template #append>
            <el-button>
              <el-icon><Check /></el-icon>
              验证
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="btn-view">
      <el-button
          type="primary"
          v-if="stepIndex != 1"
          @click="changeStep('before')"
      >上一步</el-button
      >
      <el-button
          type="primary"
          v-if="stepIndex != stepList.length"
          @click="changeStep('next')"
      >下一步</el-button
      >
      <el-button
          type="primary"
          @click="confrimBtn"
          v-if="stepIndex == stepList.length"
      >完成</el-button
      >
    </div>
  </el-dialog>
</template>

<script setup>
  import { reactive, ref } from "@vue/reactivity";
  import { Check } from "@element-plus/icons-vue";
  import QrcodeVue from "qrcode.vue";
  const pageState = reactive({
    androidCode:
        "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
    iosCode: "https://apps.apple.com/cn/app/google-authenticator/id388497605",
    qrcode: "",
  });
  const emit = defineEmits("closeModal");
  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  });
  const code = ref("");
  const qrcodeList = ref([
    "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
  ]);

  const stepList = ref([
    { title: "安装验证器APP", description: "用账号本人的手机安装身份验证器APP" },
    { title: "绑定身份", description: "扫描二维码完成账号绑定" },
    { title: "验证动态码", description: "输入验证器的动态验证码，并且验证" },
  ]);
  const stepIndex = ref(1);
  const confrimBtn = (val) => {
    console.log(111);
  };
  const changeStep = (type = "next") => {
    stepIndex.value = type == "next" ? stepIndex.value + 1 : stepIndex.value - 1;
  };
  const close = () => {
    emit("closeModal");
  };
</script>
<style lang="scss" scoped>
  .btn-view {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content-view {
    min-height: 400px;
    position: relative;
  }
  .qrcode-view {
    position: absolute;

    width: 100%;
    height: 100%;
  }
  .qrcode-view-image {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .scan-view {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  .code-view {
    position: absolute;
    flex-direction: column;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .code-view-input {
    width: 50%;
  }
  .des-text {
    font-size: 14px;
    margin-bottom: 40px;
    font-weight: 700;
    & > p {
      margin-bottom: 5px;
    }
  }
</style>

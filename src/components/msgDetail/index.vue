<template>
    <el-dialog
      v-model="props.addVisible"
      width="900px"
      @close="emit('closeModal')"
      title="消息详情"
    >
      <div v-loading="loading" class="new">
        <!-- 文本消息 -->
        <div v-if="msgType=='TIMTextElem'">{{ removeTip(msgBody.Text) }}</div>

        <!-- 地理位置消息 -->
        <div v-if="msgType=='TIMLocationElem'">{{msgBody}}</div>

        <!-- 表情消息 -->
        <div v-if="msgType=='TIMFaceElem'">{{msgBody}}</div>

        <!-- 自定义消息 -->
        <div v-if="msgType=='TIMCustomElem'">
            <customMsg v-if="isJSON(msgBody.Data)" :data="JSON.parse(msgBody.Data)" />
            <customMsg v-else :data="msgBody.Data" />
        </div>

        <!-- 语音消息 -->
        <div v-if="msgType=='TIMSoundElem'">{{msgBody}}</div>

        <!-- 图像消息 -->
        <div v-if="msgType=='TIMImageElem'" class="flex-center">
            <el-image style="width: 800px; height: 600px" :src="setImg(msgBody)" fit="contain" />
        </div>

        <!-- 文件消息 -->
        <div v-if="msgType=='TIMFileElem'">
            <fileMsg :data="msgBody"/>
        </div>

        <!-- 视频消息 -->
        <div v-if="msgType=='TIMVideoFileElem'">
            <videoMsg :data="msgBody"/>
        </div>

        <!-- 合并转发消息 -->
        <div v-if="msgType=='TIMRelayElem'">
            <div class="mb20 font16">{{ msgBody.Title }}</div>
            <div class="mb10 flex-wrap" v-for="(item,index) in msgBody.MsgList" :key="index">
                <div>{{ item.From_Account }}：</div>
                <div v-for="(msg,idx) in item.MsgBody" :key="idx">{{ msg.MsgContent.Text }}</div>
            </div>
            <!-- {{msgBody}} -->
            
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script setup>
  import {onMounted} from "vue";
  import { ref, reactive } from "@vue/reactivity";
  import { getCurrentInstance,watch } from "@vue/runtime-core";
  import { ElMessage } from "element-plus";
  import mixin from "@/mixins/list.js";
  import customMsg from "./module/customMsg.vue"
  import fileMsg from "./module/fileMsg.vue"
  import videoMsg from "./module/videoMsg.vue"
  const { removeTip,isJSON } = mixin();
  const { $api } = getCurrentInstance().appContext.config.globalProperties;
  //   console.log(getCurrentInstance().appContext.config.globalProperties);
  const emit = defineEmits("closeModal", "updateList");
  const props = defineProps({
    addVisible: {
        type: Boolean,
        default: false,
    },
    info: {
        type: Object,
        default: {},
    },
  });
  const addLoading = ref(false);
  const addVisible = ref(true);
  const msgData = ref(true);
  const msgBody = ref(true);
  const msgType = ref(true);
  
  const rules = {
    account: [{ required: true, message: "请输入账号", trigger: "blur" }],
    parent: [{ required: true, message: "请输入账号", trigger: "blur" }],
  };
  
  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    account : "",
    parent : "",
  });
  
  //设置图片
  const setImg = (e) =>{
    let data = e
    let url = data.ImageInfoArray[0].URL
    return url
  }
  
  const onSuccess = (val) => {};
  const handleClickChoose = () => {};
  
  watch(
    () => props.info,
    (val) => {
        msgData.value = val
        msgBody.value = JSON.parse(val.MsgBody)
        msgType.value = val.MsgType
        console.log(msgData.value)
    },
    {
        immediate: true,
        deep: true,
    }
  );
  
  </script>
  <style lang="scss" scoped></style>
  
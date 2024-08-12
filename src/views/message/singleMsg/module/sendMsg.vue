<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="私聊发送消息">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">
                
                <el-form-item label="发送人" prop="fromAccount">
                    <el-input v-model="form.fromAccount" type="text" placeholder="请输入发送人账号" />
                </el-form-item>

                <el-form-item label="接收人" prop="toAccount">
                    <el-input v-model="form.toAccount" type="text" placeholder="请输入接收人账号" />
                </el-form-item>

                <el-form-item label="消息类型" prop="msgtype">
                    <el-select v-model="form.msgtype">
                        <el-option
                        v-for="item in typeList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="消息内容" prop="msgcontent">
                    <el-input v-model="form.msgcontent" type="textarea" placeholder="请输入消息内容" />
                </el-form-item>

                <el-row class="btn-container">
                    <el-button size="small" :loading="editLoading" type="primary" @click="submitForm()">
                        <i class="fa fa-plus"> </i> 确认发送
                    </el-button>
                </el-row>
            </el-form>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
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
    tagData: [],
});
const addVisible = ref(true);
const editLoading = ref(false);

const typeList = ref([
    {name: '文本消息',key: 'TIMTextElem'},
    // {name: '地理位置消息',key: 'TIMLocationElem'},
    // {name: '表情消息',key: 'TIMFaceElem'},
    // {name: '自定义消息',key: 'TIMCustomElem'},
    // {name: '语音消息',key: 'TIMSoundElem'},
    // {name: '图像消息',key: 'TIMImageElem'},
    // {name: '文件消息',key: 'TIMFileElem'},
    // {name: '视频消息',key: 'TIMVideoFileElem'},
    // {name: '合并转发消息',key: 'TIMRelayElem'},
])

const rules = {
    // fromAccount: [{ required: true, message: "请输入发送账号", trigger: "blur" }],
    toAccount: [{ required: true, message: "请输入接收账号", trigger: "blur" }],
    msgtype: [{ required: true, message: "请输入消息类型", trigger: "blur" }],
    msgcontent: [{ required: true, message: "请输入发送内容", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    fromAccount: "",
    toAccount: "",
    msgtype: "TIMTextElem",
    msgcontent: "",
    // toAccount: "",
});

// watch(
//     () => props.info,
//     (val) => {
//         let { GroupId } = val;
//         form.groupId = GroupId;
//     },
//     {
//         immediate: true,
//         deep: true,
//     }
// );

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let params = null
            if(form.msgtype=='TIMTextElem'){
                params = {
                    ...form,
                    msgcontent: JSON.stringify({ Text: form.msgcontent })
                }
            }

            editLoading.value = true;
            $api.singleMsg
                .send_msg(params)
                .then((res) => {
                    console.log("form", res);
                    if (res.result) {
                        ElMessage({
                            showClose: true,
                            message: "发送成功",
                        });
                        // emit("updateList");
                        emit("closeModal");
                    }
                })
                .finally(() => {
                    editLoading.value = false;
                });
        }
    });
};
</script>
<style lang="scss" scoped>
.el-select {
    flex: 1;
}
</style>
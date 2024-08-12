<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="编辑">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">
                
                <el-form-item label="群ID" prop="groupId">
                    <el-input v-model="form.groupId" disabled type="text" placeholder="请输入群ID" />
                </el-form-item>

                <el-form-item label="msgseq" prop="msgseq">
                    <el-input v-model="form.msgseq" disabled type="text" placeholder="请输入msgseq" />
                </el-form-item>

                <el-form-item label="消息类型" prop="msgtype">
                    <el-select v-model="form.msgtype" disabled>
                        <el-option
                        v-for="item in typeList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="消息内容" prop="msgcontent">
                    <el-input v-model="form.msgcontent" type="text" placeholder="请输入消息内容" />
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
    groupId: [{ required: true, message: "请输入群id", trigger: "blur" }],
    msgseq: [{ required: true, message: "msgseq", trigger: "blur" }],
    msgtype: [{ required: true, message: "请输入消息类型", trigger: "blur" }],
    msgcontent: [{ required: true, message: "请输入发送内容", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    groupId: "",
    msgseq: "",
    msgtype: "",
    msgcontent: "",
    // toAccount: "",
});

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
            $api.groupmsg
                .modify_group_msg(params)
                .then((res) => {
                    console.log("form", res);
                    if (res.result) {
                        ElMessage({
                            showClose: true,
                            message: "修改成功",
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

watch(
    () => props.info,
    (val) => {
        let { GroupId,MsgSeq,MsgType,MsgBody } = val;
        form.groupId = GroupId;
        form.msgseq = MsgSeq;
        form.msgtype = MsgType;
        let msg = (JSON.parse(MsgBody)).Text
        form.msgcontent = msg;
    },
    {
        immediate: true,
        deep: true,
    }
);
</script>
<style lang="scss" scoped>
.el-select {
    flex: 1;
}
</style>
<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="添加机器人">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">

                <el-form-item label="账号" prop="account">
                    <el-input v-model="form.account" type="text" placeholder="请输入账号" />
                </el-form-item>

                <el-form-item label="昵称" prop="nick">
                    <el-input v-model="form.nick" type="text" placeholder="请输入昵称" />
                </el-form-item>

                <el-form-item label="类型" prop="type">
                    <el-select v-model="form.type">
                        <el-option v-for="item in robotType" :key="item.key" :label="item.name" :value="item.key" />
                    </el-select>
                </el-form-item>

                <el-form-item label="个性签名" prop="signature">
                    <el-input v-model="form.signature" type="text" placeholder="个性签名" />
                </el-form-item>

                <el-form-item label="头像" prop="faceurl">
                    <!-- <el-input v-model="form.faceurl" type="text" placeholder="个性签名" /> -->
                    <!-- <uploadModule/> -->
                    <el-upload class="avatar-uploader" :limit="1" :show-file-list="false" :auto-upload="false"
                        :file-list="state.fileList" :on-change="handleChange" element-loading-text="图片上传中"
                        v-loading="uploadLoading">
                        <el-image v-if="form.faceurl" style="width: 100px; height: 100px" :src="form.faceurl" fit="scale-down" />
                        <!-- <img v-if="form.faceurl" :src="form.faceurl" class="avatar" /> -->
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-row class="btn-container">
                    <el-button size="small" :loading="editLoading" type="primary" @click="submitForm()">
                        <i class="fa fa-plus"> </i> 确认添加
                    </el-button>
                </el-row>
            </el-form>
        </div>
    </el-dialog>
</template>
  
<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import mixin from "@/mixins/list.js";
const { uploadFiles } = mixin();
// import uploadModule from "@/components/uploadFile/index.vue"
const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
    addVisible: {
        type: Boolean,
        default: false,
    },
    account: '',
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
    account: [{ required: true, message: "请输入账号", trigger: "blur" }],
    nick: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    type: [{ required: true, message: "请选择类型", trigger: "blur" }],
    signature: [{ required: true, message: "请输入个性签名", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    account: "",
    nick: "",
    type: 1,
    signature: "",
    faceurl: ""
});
const state = reactive({
    fileList: []
});
const robotType = [
    { name: '记账机器人', key: 1 }
]

watch(
    () => props.addVisible,
    (val) => {
        if (val) {

        }
    },
    {
        immediate: true,
        deep: true,
    }
);
const onSuccess = (val) => { };
const handleClickChoose = () => { };

const uploadLoading = ref(false)

const handleChange = async (file) => {
    uploadLoading.value = true
    let imgUrl = await uploadFiles(file.raw)
    form.faceurl = imgUrl;
    uploadLoading.value = false
}

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            $api.appRobot
                .add(form)
                .then((res) => {
                    if (res.result) {
                        ElMessage({
                            type: "success",
                            showClose: true,
                            message: "添加成功",
                        });
                        emit("updateList");
                        emit("closeModal");
                    }
                })
                .finally(() => {
                    addLoading.value = false;
                });
        }
    });
};
</script>
<style lang="scss" scoped>
.el-select {
    flex: 1;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
    border: 1px dashed #8c939d;
    border-radius: 6px;
}

.avatar {
    width: 100px;
    height: 100px;
}
</style>
  
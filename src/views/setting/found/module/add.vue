<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="添加">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">

                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" type="text" placeholder="请输入名称" />
                </el-form-item>

                <el-form-item label="链接" prop="link">
                    <el-input v-model="form.link" type="text" placeholder="请输入链接" />
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input v-model="form.order" type="number" placeholder="请输入排序" />
                </el-form-item>

                <el-form-item label="分组" prop="type">
                    <el-input v-model="form.type" type="number" placeholder="请输入分组" />
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status">
                        <el-option v-for="item in statusType" :key="item.key" :label="item.name" :value="item.key" />
                    </el-select>
                </el-form-item>

                <el-form-item label="移动端图标" prop="icon">
                    <!-- <el-input v-model="form.faceurl" type="text" placeholder="个性签名" /> -->
                    <!-- <uploadModule/> -->
                    <el-upload class="avatar-uploader" :limit="1" :show-file-list="false" :auto-upload="false"
                        :on-change="handleChange" element-loading-text="图片上传中" v-loading="uploadLoading">
                        <el-image v-if="form.icon" style="width: 100px; height: 100px" :src="form.icon" fit="scale-down" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

                <el-form-item label="pc端图标" prop="icon_pc">
                    <el-upload class="avatar-uploader" :limit="1" :show-file-list="false" :auto-upload="false"
                        :on-change="handleChangePc" element-loading-text="图片上传中" v-loading="uploadLoading2">
                        <el-image v-if="form.icon_pc" style="width: 100px; height: 100px" :src="form.icon_pc" fit="scale-down" />
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
    tagData: {
        type: Array,
        default: [],
    },
    account: '',
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    // link: [{ required: true, message: "请输入链接", trigger: "blur" }],
    icon: [{ required: true, message: "请上传图标", trigger: "blur" }],
    icon_pc: [{ required: true, message: "请上传图标", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "blur" }],
    order: [{ required: true, message: "请输入排序", trigger: "blur" }],
    type: [{ required: true, message: "请选择类型", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    name: "",
    link: "",
    icon: "",
    icon_pc: "",
    status: 1,
    order: "",
    type: ""
});
const statusType = [
    { name: '上线', key: 1 },
    { name: '下线', key: 2 }
]

const state = reactive({
    fileList: []
});

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

const uploadLoading2 = ref(false)

const handleChange = async(file) => {
    console.log("🚀 ~ 移动端")
    uploadLoading.value = true
    let imgUrl = await uploadFiles(file.raw)
    form.icon = imgUrl;
    uploadLoading.value = false
}

const handleChangePc = async(file2) => {
    console.log("🚀 ~ pccccccccccccccccc")
    uploadLoading2.value = true
    let imgUrl2 = await uploadFiles(file2.raw)
    form.icon_pc = imgUrl2;
    uploadLoading2.value = false
}

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            $api.appDiscovery
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
  
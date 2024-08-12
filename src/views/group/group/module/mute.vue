<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="禁言">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">
                <el-form-item label="禁言账号" prop="account">
                    <div>{{ props.info.Account }}</div>
                </el-form-item>
                <el-form-item label="禁言时间" prop="muteTime">
                    <el-input v-model="form.muteTime" type="number" placeholder="请输入封禁时间(秒)" />
                </el-form-item>

                <el-row class="btn-container">
                    <el-button size="small" :loading="editLoading" type="primary" @click="submitForm()">
                        <i class="fa fa-plus"> </i> 确认修改
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

const rules = {
    // name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
    muteTime: [{ required: true, message: "请输入禁言时间（秒）", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    groupId: "",
    list: "",
    // desc: "",
    muteTime: 0,
});

watch(
    () => props.info,
    (val) => {
        let { GroupId } = val;
        form.groupId = GroupId;
    },
    {
        immediate: true,
        deep: true,
    }
);

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let list = props.info.Account.split(",");
            form.list = list;
            form.muteTime = Number(form.muteTime);
            editLoading.value = true;
            $api.chatGroupMember
                .forbid_send_msg(form)
                .then((res) => {
                    console.log("form", res);
                    if (res.result) {
                        ElMessage({
                            showClose: true,
                            message: "禁言成功",
                        });
                        emit("updateList");
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
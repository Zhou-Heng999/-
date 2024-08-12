<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="新增敏感词">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">

                <el-form-item label="敏感词" prop="word">
                    <el-input v-model="form.word" type="textarea" placeholder="请输入敏感词" />
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
    word: [{ required: true, message: "请输入敏感词", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    word: "",
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
            editLoading.value = true;
            $api.appWords.appWordsAdd(
                {
                   word:form.word 
                }
            )
                .then((res) => {
                    console.log("form", res);
                    if (res.result) {
                        ElMessage({
                            showClose: true,
                            message: "新增成功",
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
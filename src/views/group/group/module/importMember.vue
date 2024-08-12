<template>
    <el-dialog v-model="props.addVisible" width="632px" @close="emit('closeModal')" title="导入群员">
        <div v-loading="loading" class="new">
            <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="100px">
                <!-- <el-form-item label="群员ID" prop="list">
            <el-space direction="vertical">
                <el-space v-for="(item, index) in form.itemList" :key="item.key">
                  <el-input v-model="item.name" :placeholder="$t('558')"></el-input>
                  <el-input v-model="item.key" :placeholder="$t('559')"></el-input>
                  <el-select v-model="item.color" :placeholder="$t('560')">
                    <el-option
                      v-for="item in colorList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-input
                    v-model="item.remark"
                    :placeholder="$t('备注')"
                  ></el-input>
    
                  <el-input v-model="item.lan" :placeholder="$t('561')"></el-input>
                  <el-select v-model="item.status" :placeholder="$t('319')">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-button :icon="Plus" @click="addItem" />
                  <el-button :icon="Minus" @click="deleItem(index)" />
                </el-space>
              </el-space>
          </el-form-item> -->

                <el-form-item label="群员ID" prop="account">
                    <el-input v-model="form.account" placeholder="请输入账号，多个可用','隔开"></el-input>
                </el-form-item>

                <el-form-item label="角色" prop="role">
                    <el-select v-model="form.role">
                        <el-option v-for="item in roleList" :key="item.key" :label="item.name" :value="item.key" />
                    </el-select>
                </el-form-item>

                <el-form-item label="入群时间" prop="joinTime">
                    <el-date-picker v-model="form.joinTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="x"
                        placeholder="请选择入群时间" />
                    <!-- <el-input v-model="form.joinTime" placeholder="请输入账号，多个可用','隔开"></el-input> -->
                </el-form-item>

                <el-form-item label="未读消息数" prop="unreadMsgNum">
                    <el-input v-model="form.unreadMsgNum" placeholder="请输入未读消息数"></el-input>
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
const { $api } = getCurrentInstance().appContext.config.globalProperties;
//   console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
    addVisible: {
        type: Boolean,
        default: false,
    },
    roleData: [],
    groupId: ''
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
    account: [{ required: true, message: "请输入群成员ID", trigger: "blur" }],
    // role: [{ required: true, message: "请输入群成员角色", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const roleList = ref([
    // {name: '群员', key: ''},
    { name: '管理员', key: 'Admin' }
])

const form = reactive({
    // groupId: "",
    account: "",
    role: "",
    joinTime: "",
    unreadMsgNum: ""
});

watch(
    () => props.addVisible,
    (val) => {
        if (val) {
            // form.groupId = props.groupId
        }
    },
    {
        immediate: true,
        deep: true,
    }
);

const submitForm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let timestamp = form.joinTime
            form.joinTime = timestamp / 1000
            let list = [{ ...form }]
            let newForm = {
                groupId: props.groupId,
                list: JSON.stringify(list)
            }
            console.log(newForm)
            addLoading.value = true;
            $api.chatGroupMember
                .import_group_member(newForm)
                .then((res) => {
                    if (res.result) {
                        ElMessage({
                            type: "success",
                            showClose: true,
                            message: "导入成功",
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
</style>
  
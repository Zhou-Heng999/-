<template>
    <el-dialog v-model="props.addVisible" width="80vw" @close="emit('closeModal')" title="好友列表">
        <div v-loading="loading">
            <table-modal v-if="state.isShowTable" :tableHeader="column" :valueForm="queryParam"
                tableUrl="appUserFriend.list" ref="tableRef" height="50vh">
                <template #default="scope">
                    <slot v-if="scope.row && scope.row.key == 'edit_row'">
                        
                        <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                            title="确定删除该好友吗？" @confirm="handleDelete(scope.$index, scope.row)">
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                            title="确定拉黑好友吗？" @confirm="handleBlack(scope.$index, scope.row)">
                            <template #reference>
                                <el-button size="small" type="danger">拉黑</el-button>
                            </template>
                        </el-popconfirm>
                    </slot>

                </template>
                <template #leftView>
                    <el-button type="primary" @click="isAddShow = true">添加好友</el-button>
                    <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                        title="确定删除所有好友吗？" @confirm="delAllFriends()">
                        <template #reference>
                            <el-button type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </table-modal>
        </div>
    </el-dialog>

    <add-modal :addVisible="isAddShow" :tagData="props.tagData" @updateList="update" @closeModal="isAddShow = false"
        :account="props.info.userID" :tableData="state.tableData"/>

    <ban-modal v-if="isBanShow" :addVisible="isBanShow" :tagData="tagData" @updateList="update"
        @closeModal="isBanShow = false" :info="banInfo" />

    <import-member :addVisible="isImportShow" :tagData="props.tagData" @updateList="update" @closeModal="isImportShow = false"
    :groupId="props.info.GroupId" />
    
</template>
  
<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
import addModal from "./add.vue";
// import banModal from "./ban.vue";
// import importMember from "./importMember.vue";
import mixin from "@/mixins/list.js";
const { setTimestamp } = mixin();
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

const isAddShow = ref(false)
const isBanShow = ref(false)
const isImportShow = ref(false)
const banInfo = ref();
const nowTime = ref();
const handleInfo = ref();

const column = [
    { title: "账号", key: "To_Account",fixed: 'left'},
    { title: "昵称", key: "Tag_Profile_IM_Nick" },
    { title: "性别", key: "Tag_Profile_IM_Gender",typeList: 'Gender_Type' },
    { title: "添加时间", key: "log_time", keyType: 'time' },
    // { title: "群名片", key: "NameCard" },
    // { title: "角色", key: "Role" },
    // { title: "消息屏蔽类型", key: "MsgFlag" },
    // { title: "禁言到", key: "MuteUntil",isNeedSlot: true },
    // { title: "加入方式", key: "JoinType" },
    // { title: "邀请人", key: "Operator_Account" },
    // { title: "入群时间", key: "EventTime", keyType: "time", width: '90' },
    // { title: "状态", key: "status",isNeedSlot: true },
    { title: "操作", key: "edit_row" },
    // { title: "", key: "setOwner",isNeedSlot: true },
];

const state = reactive({
    groupId: "",
    isShowTable: false,
    tableData: []
});

const rules = {
    name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
    code: [{ required: true, message: "请输入渠道代码", trigger: "blur" }],
    appid: [{ required: true, message: "请选择应用", trigger: "blur" }],
};

const formConfig = reactive({
    // 搜索栏配置项
    formItemList: [],
});
const queryParam = reactive({
    //搜索表单
    account: "",
    start_time: "",
    end_time: "",
});

const formRef = ref();
const loading = ref(false);
const form = reactive({
    id: "",
    name: "",
    code: "",
    appid: "",
});


// 更新列表
const update = () => {
    proxy.$refs["tableRef"].getTableList();
};

//删除所有好友
const delAllFriends = () => {
    $api.appUserFriend
        .del_all({
            From_Account: props.info.userID,
            DeleteType: "Delete_Type_Both",
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "删除成功",
            });
            update();
        });
}

const handleBlack = (idx, row) => {
    let { To_Account, From_Account } = row;
    let list = [];
    list.push(To_Account);
    $api.appUserBlack
        .add({
            From_Account: From_Account,
            Accountlist: list
        })
        .then((res) => {
            if(res.data.Fail_Account==null){
                ElMessage({
                    type: "success",
                    showClose: true,
                    message: "拉黑成功",
                });
            }else{
                ElMessage({
                    type: "success",
                    showClose: true,
                    message: "拉黑失败",
                });
            }
            update();
        });
};

const handleDelete = (idx, row) => {
    let { To_Account, From_Account } = row;
    let list = [];
    list.push(To_Account);
    $api.appUserFriend
        .del({
            From_Account: From_Account,
            To_Account: list,
            DeleteType: "Delete_Type_Both",
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "删除成功",
            });
            update();
        });
};

watch(
    [
        () => props.info,
        () => isAddShow.value
    ],
    ([info,isAddShow]) => {
        if(info){
            queryParam.account = info.userID;
            state.isShowTable = true;
        }
        if(isAddShow){
            state.tableData = proxy.$refs["tableRef"].tableData();
            // console.log(state.tableData)
        }
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
  
<template>
    <el-dialog v-model="props.addVisible" width="80vw" @close="emit('closeModal')" title="群员列表">
        <div v-loading="loading">
            <table-modal v-if="state.isShowTable" :tableHeader="column" :valueForm="queryParam"
                tableUrl="chatGroupMember.list" ref="tableRef" height="49vh">
                <template #default="scope">
                    
                    <slot v-if="scope.row && scope.row.key == 'Account'">
                        <el-link type="primary" @click="showUserDetail(scope.$index, scope.row)">{{scope.row.Account}}</el-link>
                    </slot>

                    <slot v-if="scope.row && scope.row.key == 'Role'">
                        <div>{{ roleList[scope.row.Role] }}</div>
                    </slot>

                    <slot v-if="scope.row && scope.row.key == 'MuteUntil'">
                        <!-- <div>{{ scope.row.MuteUntil==0? '未禁言': setTimestamp(scope.row.MuteUntil) }}</div> -->
                        <!-- <div>{{ scope.row.MuteUntil==0? '未禁言': '禁言中' }}</div> -->
                        <el-tag v-if="scope.row.MuteUntil==0" round type="success">未禁言</el-tag>
                        <el-tag v-if="scope.row.MuteUntil!=0" round type="danger">禁言中</el-tag>
                    </slot>

                    <slot v-if="scope.row && scope.row.key == 'virtual'">
                        <div>{{ scope.row.virtual==1? '虚拟用户': '真实用户' }}</div>
                    </slot>

                    <slot v-if="scope.row && scope.row.key == 'edit_row'">

                        <multipleBtn width="450">
                            <el-button v-if="scope.row.Role != 'Owner'" size="small" @click="setAdmin(scope.$index, scope.row)">
                                {{scope.row.Role == 'Admin'? '取消管理员':'设为管理员'}}
                            </el-button>
                            <el-button v-if="scope.row.Role != 'Owner'" size="small" @click="setOwner(scope.$index, scope.row)">
                                转让群主
                            </el-button>

                            <el-button size="small"  :type="scope.row.MuteUntil>nowTime? '':'danger'" @click="handleMute(scope.$index, scope.row)">
                                {{scope.row.MuteUntil>nowTime? '取消禁言':'禁言'}}
                            </el-button>

                            <!-- <el-button size="small"  :type="scope.row.MuteUntil>nowTime? '':'danger'" @click="handleBan(scope.$index, scope.row)">
                                {{scope.row.MuteUntil>nowTime? '取消封禁':'封禁'}}
                            </el-button> -->
                            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                                title="确定踢出该群成员吗？" @confirm="handleDelete(scope.$index, scope.row)">
                                <template #reference>
                                    <el-button size="small" type="danger">踢出</el-button>
                                </template>
                            </el-popconfirm>
                            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                                title="确定删除该群成员的全部消息吗？" @confirm="DelAllMsg(scope.$index, scope.row)">
                                <template #reference>
                                    <el-button size="small" type="danger">删除群员消息</el-button>
                                </template>
                            </el-popconfirm>
                        </multipleBtn>

                    </slot>
                </template>
                <template #leftView>
                    <el-button type="primary" @click="isAddShow = true">新增群员</el-button>
                    <!-- <el-button type="primary" @click="isImportShow = true">导入群员</el-button> -->
                </template>
            </table-modal>
        </div>
    </el-dialog>

    <add-modal :addVisible="isAddShow" :tagData="props.tagData" @updateList="update" @closeModal="isAddShow = false"
        :groupId="props.info.GroupId" />

    <ban-modal v-if="isBanShow" :addVisible="isBanShow" :tagData="tagData" @updateList="update"
        @closeModal="isBanShow = false" :info="handleInfo" />

    <mute-modal v-if="isMuteShow" :addVisible="isMuteShow" :tagData="tagData" @updateList="update"
        @closeModal="isMuteShow = false" :info="handleInfo" />

    <import-member :addVisible="isImportShow" :tagData="props.tagData" @updateList="update" @closeModal="isImportShow = false"
    :groupId="props.info.GroupId" />

    <edit-modal
    v-if="isDetailShow"
    :addVisible="isDetailShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isDetailShow = false"
    :info="editInfo"
  />
    
</template>
  
<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
import editModal from "@/components/userDetail/index.vue";
import addModal from "./addMember.vue";
import banModal from "./ban.vue";
import muteModal from "./mute.vue";
import importMember from "./importMember.vue";
import multipleBtn from "@/components/multipleBtn/index.vue"
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
const isMuteShow = ref(false)
const isImportShow = ref(false)
const isDetailShow = ref(false)
const handleInfo = ref();
const nowTime = ref();
const editInfo = ref();

const column = [
    { title: "账号", key: "Account",fixed: 'left',isNeedSlot: true },
    { title: "群ID", key: "GroupId" },
    { title: "用户类型", key: "virtual",isNeedSlot: true },
    // { title: "群名片", key: "NameCard" },
    { title: "角色", key: "Role", typeList: 'Group_Role' },
    { title: "消息屏蔽类型", key: "MsgFlag", typeList: 'Msg_Flag' },
    { title: "禁言到", key: "MuteUntil",isNeedSlot: true },
    { title: "加入方式", key: "JoinType", typeList: 'Join_Type' },
    { title: "邀请人", key: "Operator_Account" },
    { title: "入群时间", key: "EventTime", keyType: "time", width: '90' },
    // { title: "状态", key: "status",isNeedSlot: true },
    { title: "操作", key: "edit_row" },
    // { title: "", key: "setOwner",isNeedSlot: true },
];

const state = reactive({
    groupId: "",
    isShowTable: false,
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
    groupId: "",
});

// 群角色
const roleList = {
    'Member': "群员",
    'Admin': "管理员",
    'Owner': "群主",
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
    id: "",
    name: "",
    code: "",
    appid: "",
});

const showUserDetail = (idx, row) => {
    let info = {
        account: row.Account
    }
    editInfo.value = info;
    isDetailShow.value = true;

}

// 设置禁言
const handleMute = (idx, row) => {
    let {GroupId,Account,MuteUntil} = row
    let list = []
    list.push(Account)
    $api.chatGroupMember
    .forbid_send_msg({
        groupId: GroupId,
        list: list,
        muteTime: MuteUntil==0? 4294967295 : 0, //当前只设置永久禁言或者接触禁言
    })
    .then((res) => {
        ElMessage({
            type: "success",
            showClose: true,
            message: MuteUntil==0?  "禁言成功":"解除禁言成功",
        });
        update();
    });
}

// 设置封禁
const handleBan = (idx, row) => {
    let isBan = false
    let {GroupId,Account} = row
    if(isBan){
        let list = `["${Account}"]`
        $api.chatGroupMember
        .unban({
            groupId: GroupId,
            list: list,
            muteTime: 0,
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "解除封禁成功",
            });
            update();
        });
    }else{
        handleInfo.value = row;
        isBanShow.value = true
    }
}

// 设置管理员
const setAdmin = (idx, row) =>{
    let { Account, GroupId, Role } = row;
    $api.chatGroupMember
        .modify_group_member_info({
            groupId: GroupId,
            account: Account,
            role: Role=="Member"? "Admin":"Member",
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "设置成功",
            });
            update();
        });
}

//转让群主
const setOwner = (idx, row) =>{
    let { Account, GroupId } = row;
    $api.chatGroup
        .change_owner({
            groupId: GroupId,
            new_owner_account: Account
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "设置成功",
            });
            update();
        });
}

// 更新列表
const update = () => {
    proxy.$refs["tableRef"].getTableList();
};

//删除该群员消息
const DelAllMsg = (idx, row) => {
    let { Account, GroupId } = row;
    $api.groupmsg
        .delete_group_msg_by_sender({
            groupId: GroupId,
            senderAccount: Account,
            // topicId: "",
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "清除成功",
            });
            // update();
        });
};


const handleDelete = (idx, row) => {
    let { Account, GroupId } = row;
    let list = [];
    list.push(Account);
    //   console.log(JSON.stringify(list));
    $api.chatGroupMember
        .del({
            groupId: GroupId,
            list: list,
            reason: "",
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

//获取当前时间
const getNowtime = () => {
    let time = new Date().getTime()
    let ten_time = (time.toString()).slice(0,10)
    nowTime.value = Number(ten_time)
}

watch(
    () => props.info,
    (val) => {
        console.log(val);
        queryParam.groupId = val.GroupId;
        state.isShowTable = true;
        getNowtime()
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
  
<template>
    <table-modal v-if="state.isShowTable" :tableHeader="column" :formConfig="formConfig" :valueForm="queryParam"
        tableUrl="appGroupBillLog.list" ref="tableRef" @searchReset="searchReset">
        <!-- <template #default="scope">
            <slot v-if="scope.row && scope.row.key == 'edit_row'">
                <el-button size="small" type="primary" :disabled="scope.row.MsgType != 'TIMTextElem'"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </slot>
        </template> -->
    </table-modal>

    <!-- <add-modal
    :addVisible="isAddShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isAddShow = false"
  /> -->
    <!-- <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isEditShow = false"
    :info="msgInfo"
  />
    <msgDetail
    v-if="isShowMsg"
    :addVisible="isShowMsg"
    :tagData="tagData"
    @updateList="$upTableList(tableRef)"
    @closeModal="isShowMsg = false"
    :info="msgInfo"></msgDetail>
  
    <detailModal
      v-if="isDetailShow"
      :addVisible="isDetailShow"
      :tagData="tagData"
      @updateList="$upTableList(tableRef)"
      @closeModal="isDetailShow = false"
      :info="editInfo"
    ></detailModal> -->
</template>
<script setup>
import {
    computed,
    defineComponent,
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    toRefs,
} from "vue";
// import addModal from "./module/add.vue";
//   import editModal from "./module/edit.vue";
//   import msgDetail from "./module/msgDetail.vue";
//   import detailModal from "@/components/userDetail/index.vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const { num } = mixin();
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const isShowMsg = ref(false);
const isDetailShow = ref(false)
const router = useRouter();
const codeType = ref("");
const filterTableRef = ref();
const tableLoading = ref(true);
const rowUserId = ref();
const state = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    search: "",
    tagData: [],
    total: 0,
    channelList: [],
    isShowTable: false
});
const tableRef = ref(null);
const dialogFormVisible = ref(true);

const column = [
    { title: "id", key: "id" },
    // { title: "", key: "round" },
    { title: "群id", key: "groupId" },
    { title: "名称", key: "Name" },
    { title: "账号", key: "account" },
    { title: "命令", key: "cmd" },
    { title: "时间", key: "create_at", keyType: "time" },
    { title: "值", key: "value" },
    // { title: "", key: "rate" },
    { title: "消息", key: "msg" },
];

const formConfig = reactive({
    // 搜索栏配置项
    formItemList: [
        { type: "input", placeholder: "群ID", key: "groupId", width: 200 },
        {
            type: "datetimerange",
            key: ["start_time", "end_time"],
            placeholder: ["开始时间", "结束时间"],
        },
    ],
});
const queryParam = reactive({
    //搜索表单
    groupId: "",
    start_time: "",
    end_time: "",
});

// const total = computed(() => state.tableData.length);
const editInfo = ref();
const msgInfo = ref();

onMounted(() => {
    // getChannelList();
    getGroupId()
    // getTag();
});
const tableRowClassName = (e) => {
    let { row, rowIndex } = e;
    // console.log(row, rowIndex, store.state.app.userInfo.username);
    if (row.name == store.state.app.userInfo.username) {
        return "warning-row";
    }
    return "";
};

// methods

const searchReset = () => {
    queryParam['start_time,end_time'] = [0,0]
}

const showUserDetail = (account) => {
    let info = {
        account: account
    }
    editInfo.value = info;
    isDetailShow.value = true;
}

//获取群id搜索
const getGroupId = () => {
    let id = store.state.app.groupId
    queryParam.groupId = id;
    store.commit('app/setGroupId', '')
    state.isShowTable = true
}

const up = () => {
    proxy.$refs["tableRef"].getTableList();
};

//设置图片
const setImg = (e) => {
    let data = JSON.parse(e)
    let url = data.ImageInfoArray[0].URL
    return url
}

const handleOnline = (index, row) => {
    $api.channel
        .online({
            id: row.id,
            status: row.status == 0 ? 1 : 0,
        })
        .then((res) => {
            up();
        });
};

const checkMsg = (idx, row) => {
    console.log(row);
    isShowMsg.value = true;
    msgInfo.value = row;
};

//获取渠道列表
const getChannelList = () => {
    $api.channel
        .list({
            size: 200,
            page: 1,
        })
        .then((res) => {
            let data = [];
            res.data.list.forEach((item) => {
                data.push({
                    value: item.code,
                    label: item.name,
                });
            });
            formConfig.formItemList[3].options = data;
            // console.log("formConfig", formConfig);
        });
};

const getTag = () => {
    $api.dictionary
        .list({
            size: "100",
            page: "1",
        })
        .then((res) => {
            console.log("res", res);
            // let a = res.data.find((item) => item.type == "CURRENCY_CODE");
            // state.tagData = a.itemList;
            // console.log("tagData", state.tagData);
        });
};

const formatter = (row) => row.address;
const filterTag = (value, row) => row.tag === value;
const filterHandler = (value, row, column) => {
    const { property } = column;
    return row[property] === value;
};
const handleEdit = (index, row) => {
    // eslint-disable-next-line no-console
    isEditShow.value = true;
    msgInfo.value = row;
};
// 删除
const handleDelete = (index, row) => {
    console.log(row);
    $api.channel
        .del({
            id: row.id,
        })
        .then((res) => {
            ElMessage({
                type: "success",
                showClose: true,
                message: "删除成功",
            });
            up();
            // state.tableData.splice(index, 1);
        });
};
</script>
<style lang="scss" scoped>
.msg-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.msgClass {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    height: 100px;
}

.msg-text {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /* 设置最大显示行数 */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    // width: 150px;
    text-align: left;
}

.table-container {
    .form-inline {
        margin: 15px;
        text-align: left;
    }

    .table-list {
        margin: 15px;
    }
}

:deep(.el-table .warning-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>
  
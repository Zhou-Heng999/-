<template>
  <el-dialog
    v-model="props.addVisible"
    width="80vw"
    @close="emit('closeModal')"
    title="批量新增"
  >
    <div v-loading="loading">
      <table-modal
        v-if="state.isShowTable"
        :tableHeader="column"
        :valueForm="queryParam"
        :tableList="state.excelList"
        ref="tableRef"
        height="49vh"
      >
        <template #default="scope">
          <slot v-if="scope.row && scope.row.key == 'Account'">
            <el-link
              type="primary"
              @click="showUserDetail(scope.$index, scope.row)"
              >{{ scope.row.Account }}</el-link
            >
          </slot>

          <slot v-if="scope.row && scope.row.key == 'Role'">
            <div>{{ roleList[scope.row.Role] }}</div>
          </slot>

          <slot v-if="scope.row && scope.row.key == 'MuteUntil'">
            <div>
              {{
                scope.row.MuteUntil == 0
                  ? "未禁言"
                  : setTimestamp(scope.row.MuteUntil)
              }}
            </div>
          </slot>

          <slot v-if="scope.row && scope.row.key == 'virtual'">
            <div>{{ scope.row.virtual == 1 ? "虚拟用户" : "真实用户" }}</div>
          </slot>
        </template>
        <template #leftView>
          <el-button
            style="margin-right: 20px"
            type="primary"
            @click="downloadTemplate"
            >下载模板</el-button
          >
          <el-upload
            style="display: inline-block"
            action
            accept=".xlsx, .xls"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handle"
          >
            <el-button type="primary">导入数据</el-button>
          </el-upload>
          <div style="margin-left: 20px; color: gray; font-size: 14px">
            请在下载的模板中依次填入关键词
          </div>
        </template>
        <template #rightView>
          <el-button
            style="margin-right: 20px"
            type="success"
            @click="startImport"
            >开始导入</el-button
          >
        </template>
      </table-modal>
    </div>
  </el-dialog>

  />
</template>
  
<script setup>
import * as XLSX from "xlsx/xlsx.mjs";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { proxy } = getCurrentInstance();
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

const isAddShow = ref(false);
const isBanShow = ref(false);
const isDetailShow = ref(false);
const banInfo = ref();
const nowTime = ref();
const editInfo = ref();

const column = [{ title: "关键词", key: "word" }];

const state = reactive({
  groupId: "",
  isShowTable: false,
  excelList: [],
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

const genderType = {
  男: "Gender_Type_Male",
  女: "Gender_Type_Female",
};

// 群角色
const roleList = {
  Member: "群员",
  Admin: "管理员",
  Owner: "群主",
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  word: [],
});

//下载模板文件
const downloadTemplate = () => {
  let a = document.createElement("a");
  a.href = "./static/word.xlsx"; //对应模板
  // a.download = "上传模板.xlsx"; //如果文件名是英文，可以在这里修改下载的文件名
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

//文件读取
const readFile = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file); //以二进制的方式读取
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
  });
};

//添加数据到后端
const startImport = () => {
  if (state.excelList.length == 0) {
    ElMessage({
      type: "success",
      showClose: true,
      message: "请先导入一份数据",
    });
    return;
  }
  loading.value = true;
  let newArr = state.excelList;
  console.log("newArr...", newArr);
  newArr.forEach((item) => {
    form.word.push(item.word.toString());
  });
  // console.log("🚀 ~ startImport ~ newArr:", newArr)
  console.log("form.word..", JSON.stringify(form.word));
  $api.appWords
    .appWordsBatchAdd({
      words:(form.word),
    })
    .then((res) => {
      if (res.result) {
        ElMessage({
          type: "success",
          showClose: true,
          message: "添加成功",
        });
        state.excelList = [];
        emit("updateList");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 导入excel文件
const handle = async (ev) => {
  let file = ev.raw;
  if (file) {
    let data = await readFile(file);
    let workbook = XLSX.read(data, { type: "binary" });
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let result = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    // if(result.length>100){
    //     ElMessage({
    //         type: "error",
    //         showClose: true,
    //         message: "一次最多只能导入100条",
    //     });
    //     return
    // }
    state.excelList = result;
    console.log("🚀 ~ handle ~ result:", result);
  }
};

const showUserDetail = (idx, row) => {
  let info = {
    account: row.Account,
  };
  editInfo.value = info;
  isDetailShow.value = true;
};

// 设置禁言
const handleBan = (idx, row) => {
  let isBan = false;
  let { GroupId, Account } = row;
  if (isBan) {
    let list = `["${Account}"]`;
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
          message: "解除禁言成功",
        });
        update();
      });
  } else {
    banInfo.value = row;
    isBanShow.value = true;
  }
};

// 设置管理员
const setAdmin = (idx, row) => {
  let { Account, GroupId, Role } = row;
  $api.chatGroupMember
    .modify_group_member_info({
      groupId: GroupId,
      account: Account,
      role: Role == "Member" ? "Admin" : "Member",
    })
    .then((res) => {
      ElMessage({
        type: "success",
        showClose: true,
        message: "设置成功",
      });
      update();
    });
};

//转让群主
const setOwner = (idx, row) => {
  let { Account, GroupId } = row;
  $api.chatGroup
    .change_owner({
      groupId: GroupId,
      new_owner_account: Account,
    })
    .then((res) => {
      ElMessage({
        type: "success",
        showClose: true,
        message: "设置成功",
      });
      update();
    });
};

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
  let time = new Date().getTime();
  let ten_time = time.toString().slice(0, 10);
  nowTime.value = Number(ten_time);
};

watch(
  () => props.info,
  (val) => {
    // console.log(val);
    // queryParam.groupId = val.GroupId;
    state.isShowTable = true;
    // getNowtime()
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style lang="scss" scoped>
</style>
  
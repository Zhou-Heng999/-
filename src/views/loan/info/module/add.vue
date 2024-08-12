<template>
  <el-dialog
    v-model="props.addVisible"
    width="800px"
    @close="emit('closeModal')"
    title="新增币种"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="200px"
      >
        <el-form-item label="排序号" prop="idx">
          <el-input v-model="form.idx" placeholder="请输入排序号"></el-input>
        </el-form-item>
        <el-form-item label="借贷币种" prop="symbol">
          <el-input
            v-model="form.symbol"
            placeholder="请输入币种符号"
          ></el-input>
        </el-form-item>
        <el-form-item label="借款比例" prop="ratio">
          <el-input
            v-model="form.ratio"
            placeholder="请输入借款比例"
          ></el-input>
        </el-form-item>
        <el-form-item label="最低借贷" prop="min_loan">
          <el-input
            v-model="form.min_loan"
            placeholder="请输入最低借贷"
          ></el-input>
        </el-form-item>

        <el-tabs
          v-model="editableTabsValue"
          type="card"
          editable
          @edit="handleTabsEdit"
        >
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <el-form-item label="周期(天)">
              <el-input-number v-model="item.day" :min="1" />
              <!-- <el-input v-model="item.day" ></el-input> -->
            </el-form-item>
            <el-form-item label="日化利率(%)">
              <el-input v-model="item.rates"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <el-row class="btn-container">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认添加
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  idx: [{ required: true, message: "请输入序号", trigger: "blur" }],
  symbol: [{ required: true, message: "请输入币种符合", trigger: "blur" }],
  ratio: [{ required: true, message: "请输入比例", trigger: "blur" }],
  min_loan: [{ required: true, message: "请输入", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  idx: "",
  symbol: "",
  ratio: "",
  min_loan: "",
  other_json: "",
});

onMounted(() => {});
let tabIndex = 1;
const editableTabsValue = ref("1");
const editableTabs = ref([
  {
    title: "周期" + tabIndex,
    name: "1",
    day: 30,
    rates: 0.001,
  },
]);
const handleTabsEdit = (targetName, action) => {
  if (action === "add") {
    if (tabIndex + 1 > 5) {
      ElMessage({
        type: "error",
        showClose: true,
        message: "最多只能设置5个周期",
      });
      return;
    }
    const newTabName = `${++tabIndex}`;
    editableTabs.value.push({
      title: "周期" + tabIndex,
      name: newTabName,
      day: 30 * tabIndex,
      rates: 0.001,
    });
    editableTabsValue.value = newTabName;
  } else if (action === "remove") {
    `${--tabIndex}`;
    const tabs = editableTabs.value;
    let activeName = editableTabsValue.value;
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            activeName = nextTab.name;
          }
        }
      });
    }

    editableTabsValue.value = activeName;
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
  }
};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.other_json = JSON.stringify(editableTabs.value);
      addLoading.value = true;
      $api.loan
        .addSymbol(form)
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
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed #8c939d;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
}
</style>

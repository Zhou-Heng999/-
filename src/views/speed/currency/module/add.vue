<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="添加币种"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="排序号" prop="c_index">
          <el-input
            v-model="form.c_index"
            placeholder="请输入排序号"
          ></el-input>
        </el-form-item>

        <el-form-item label="币种名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入币种名称"></el-input>
        </el-form-item>

        <el-form-item label="币种K线" prop="symbol_id">
          <el-select v-model="form.symbol_id" defaultSelect="form.symbol_id">
            <el-option
              v-for="item in state.currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="中文名称" prop="text">
          <el-input v-model="form.text" placeholder="请输入中文名称"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :limit="1"
            :show-file-list="false"
            name="img"
            :http-request="uploadAd"
            element-loading-text="图片上传中"
            v-loading="uploadLoading"
          >
            <img
              v-if="form.imageUrl"
              :src="$setImageUrl(form.imageUrl)"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <!--<el-form-item label="价格USDT" prop="deposit">-->
        <!--<el-input-->
        <!--v-model="form.deposit"-->
        <!--placeholder="请输入价格USDT"-->
        <!--&gt;</el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="手续费(%)" prop="fee_percent">
          <el-input
            v-model="form.fee_percent"
            placeholder="请输入手续费"
          ></el-input>
        </el-form-item>

        <el-form-item label="展示收益(%)" prop="profit_show">
          <el-input
            v-model="form.profit_show"
            placeholder="请输入展示收益"
          ></el-input>
        </el-form-item>

        <el-tabs
          v-model="editableTabsValue"
          type="card"
          editable
          class="demo-tabs"
          @edit="handleTabsEdit"
        >
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <el-form-item label="买涨">
              <el-radio-group v-model="item.bug_ty">
                <el-radio label="1" size="large" style="width: 20%">
                  <span style="color: #ff1709">亏损</span>
                </el-radio>
                <el-radio label="2" size="large" style="width: 20%">
                  <span style="color: #2ccb20">盈利</span>
                </el-radio>
                <el-radio label="3" size="large" style="width: 20%">
                  偶盈偶亏
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="买跌">
              <el-radio-group v-model="item.sell_ty">
                <el-radio label="1" size="large" style="width: 20%">
                  <span style="color: #ff1709">亏损</span>
                </el-radio>
                <el-radio label="2" size="large" style="width: 20%">
                  <span style="color: #2ccb20">盈利</span>
                </el-radio>
                <el-radio label="3" size="large" style="width: 20%">
                  偶盈偶亏
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="周期(秒)">
              <el-input v-model="item.second"></el-input>
            </el-form-item>
            <el-form-item label="收益率(%)">
              <div class="flex">
                <el-input
                  v-model="item.percents[0]"
                  placeholder="请输入最小收益率"
                ></el-input
                >-
                <el-input
                  v-model="item.percents[1]"
                  placeholder="请输入最大收益率"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="亏损率(%)">
              <div class="flex">
                <el-input
                  v-model="item.percents[2]"
                  placeholder="请输入最小亏损率"
                ></el-input
                >-
                <el-input
                  v-model="item.percents[3]"
                  placeholder="请输入最大亏损率"
                ></el-input>
              </div>
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
console.log(getCurrentInstance().appContext.config.globalProperties);
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
  c_index: [{ required: true, message: "请输入序号", trigger: "blur" }],
  name: [{ required: true, message: "请输入名字", trigger: "blur" }],
  symbol_id: [{ required: true, message: "请选择币种K线", trigger: "blur" }],
  text: [{ required: true, message: "请输入币种中文名", trigger: "blur" }],
  imageUrl: [{ required: true, message: "请上传图标", trigger: "blur" }],
  // deposit: [{ required: true, message: "请输入价格", trigger: "blur" }],
  // is_profit: [{ required: true, message: "请输入盈利类型", trigger: "blur" }],
  // min_profit_percent: [{ required: true, message: "请输入最小收益率", trigger: "blur" }],
  // max_profit_percent: [{ required: true, message: "请输入最大收益率", trigger: "blur" }],
  // min_loss_percent: [{ required: true, message: "请输入最小亏损率", trigger: "blur" }],
  // max_loss_percent: [{ required: true, message: "请输入最大亏损率", trigger: "blur" }],
  fee_percent: [{ required: true, message: "请输入手续费", trigger: "blur" }],
  profit_show: [{ required: true, message: "请输入展示收益", trigger: "blur" }],
};

onMounted(() => {
  getNonCurrencyList();
});

const formRef = ref();
const loading = ref(false);
const form = reactive({
  c_index: "",
  name: "",
  symbol_id: "",
  text: "",
  imageUrl: "",
  deposit: "0",
  is_profit: "",
  min_profit_percent: "0",
  max_profit_percent: "0",
  min_loss_percent: "0",
  max_loss_percent: "0",
  fee_percent: "",
  profit_show: "",
  percent_json: "",
});
const state = reactive({
  currencyList: [],
});
const fileList = ref([]);
const uploadLoading = ref(false);
const uploadAd = (content) => {
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      fileList.value = [{ name: res.data, url: res.url }];
      form.imageUrl = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};
const getNonCurrencyList = () => {
  $api.speed.getNonCurrencyList({}).then((res) => {
    state.currencyList = res.data;
  });
};
let tabIndex = 1;
const editableTabsValue = ref("1");
const editableTabs = ref([
  {
    title: "周期" + tabIndex,
    name: "1",
    second: 30,
    percents: [0, 0, 0, 0],
    bug_ty: "",
    sell_ty: "",
  },
]);

const handleTabsEdit = (targetName, action) => {
  if (action === "add") {
    if (tabIndex + 1 > 4) {
      ElMessage({
        type: "error",
        showClose: true,
        message: "最多只能设置4个周期",
      });
      return;
    }
    const newTabName = `${++tabIndex}`;
    editableTabs.value.push({
      title: "周期" + tabIndex,
      name: newTabName,
      second: 30 * tabIndex,
      percents: [0, 0, 0, 0],
      bug_ty: "3",
      sell_ty: "3",
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
      form.percent_json = JSON.stringify(editableTabs.value);
      addLoading.value = true;
      $api.speed
        .addCurrency(form)
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

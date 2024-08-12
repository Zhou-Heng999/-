<template>
  <el-dialog
    v-model="props.addVisible"
    width="800px"
    @close="emit('closeModal')"
    title="添加币种"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="150px"
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
        <el-form-item label="跟单规模" prop="deposit">
          <el-input
            v-model="form.deposit"
            placeholder="请输入跟单规模"
          ></el-input>
        </el-form-item>

        <el-form-item label="开放笔数" prop="max_count">
          <el-input
            v-model="form.max_count"
            placeholder="请输入开放笔数"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="剩余笔数" prop="able_count">
          <el-input
            v-model="form.able_count"
            disabled
            placeholder="请输入剩余笔数"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="用户交易次数" prop="buy_count">
          <el-input
            v-model="form.buy_count"
            placeholder="请输入用户交易次数"
          ></el-input>
        </el-form-item>
        <el-form-item label="平均收益率(%)" prop="avg_show">
          <el-input
            v-model="form.avg_show"
            placeholder="请输入平均收益率"
          ></el-input>
        </el-form-item>

        <el-form-item label="展示收益(%)" prop="min_show">
          <!-- <el-input
            v-model="form.profit_show"
            placeholder="请输入展示收益"
          ></el-input> -->
          <div class="flex">
            <el-input
              v-model="form.min_show"
              placeholder="请输入最小收益率"
            ></el-input
            >-
            <el-input
              v-model="form.max_show"
              placeholder="请输入最大收益率"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="开仓时间" prop="open_time">
          <el-date-picker
            v-model="form.open_time"
            type="datetime"
            placeholder="Pick a day"
            value-format="x"
          />
        </el-form-item>
        <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs">
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <el-form-item label="">
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
            <el-form-item label="交易周期（小时）">
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
      </el-form>
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
  deposit: [{ required: true, message: "请输入价格", trigger: "blur" }],
  max_count: [{ required: true, message: "请输入开放笔数", trigger: "blur" }],
  buy_count: [
    { required: true, message: "请输入用户交易次数", trigger: "blur" },
  ],
  open_time: [{ required: true, message: "请输入开仓时间", trigger: "blur" }],
  avg_show: [{ required: true, message: "请输入平均收益率", trigger: "blur" }],
  min_show: [{ required: true, message: "请输入收益率区间", trigger: "blur" }],

  // is_profit: [{ required: true, message: "请输入盈利类型", trigger: "blur" }],
  // min_profit_percent: [{ required: true, message: "请输入最小收益率", trigger: "blur" }],
  // max_profit_percent: [{ required: true, message: "请输入最大收益率", trigger: "blur" }],
  // min_loss_percent: [{ required: true, message: "请输入最小亏损率", trigger: "blur" }],
  // max_loss_percent: [{ required: true, message: "请输入最大亏损率", trigger: "blur" }],
  percent_json: [
    { required: true, message: "请输入交易周期", trigger: "blur" },
  ],
  // profit_show: [{ required: true, message: "请输入展示收益", trigger: "blur" }],
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
  avg_show: "",

  imageUrl: "",
  deposit: "",
  profit_show: "",
  fee_percent: "",
  max_count: "",
  buy_count: "",
  open_time: "",
  percent_json: "",
  min_show: "",
  max_show: "",
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
    second: "",
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
      second: "",
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
      let { percent_json, open_time, ...parama } = form;
      let list = JSON.parse(JSON.stringify(editableTabs.value));
      list.forEach((item) => {
        item.second = item.second * 60 * 60;
      });
      let newJson = JSON.stringify(list);
      //   form.percent_json = JSON.stringify(editableTabs.value);
      addLoading.value = true;
      //   return;
      $api.follow
        .addCurrency({
          ...parama,
          percent_json: newJson,
          open_time: open_time / 1000,
        })
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

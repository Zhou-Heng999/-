<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑币种"
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

        <!--<el-form-item label="期限单位" prop="term_type">-->
        <!--<el-radio-group v-model="form.term_type">-->
        <!--<el-radio label="1" size="large">分钟</el-radio>-->
        <!--<el-radio label="2" size="large">小时</el-radio>-->
        <!--<el-radio label="3" size="large">天</el-radio>-->
        <!--<el-radio label="4" size="large">年</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="期限" prop="term_value">-->
        <!--<el-input v-model="form.term_value" placeholder="请输入期限" />-->
        <!--</el-form-item>-->

        <el-form-item label="手续费(%)" prop="fee_percent">
          <el-input
            v-model="form.fee_percent"
            placeholder="请输入手续费"
          ></el-input>
        </el-form-item>

        <el-form-item label="盈亏开关" prop="is_open">
          <el-switch
            v-model="form.is_open"
            class="ml-2"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
            inline-prompt
            active-text="Y"
            inactive-text="N"
          />
        </el-form-item>

        <el-form-item label="盈利亏损" prop="is_profit">
          <el-radio-group v-model="form.is_profit">
            <el-radio label="0" size="large">亏损</el-radio>
            <el-radio label="1" size="large">盈利</el-radio>
            <el-radio label="2" size="large">偶盈偶亏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="收益率(%)" prop="username">
          <div class="flex">
            <el-input
              v-model="form.min_profit_percent"
              placeholder="请输入最小收益率"
            ></el-input
            >-
            <el-input
              v-model="form.max_profit_percent"
              placeholder="请输入最大收益率"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item label="亏损率(%)" prop="username">
          <div class="flex">
            <el-input
              v-model="form.min_loss_percent"
              placeholder="请输入最小亏损率"
            ></el-input
            >-
            <el-input
              v-model="form.max_loss_percent"
              placeholder="请输入最大亏损率"
            ></el-input>
          </div>
        </el-form-item>

        <!--<el-form-item label="展示收益(%)" prop="profit_show">-->
        <!--<el-input-->
        <!--v-model="form.profit_show"-->
        <!--placeholder="请输入展示收益"-->
        <!--&gt;</el-input>-->
        <!--</el-form-item>-->

        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="editLoading"
            type="primary"
            @click="submitForm()"
          >
            <i class="fa fa-plus"> </i> 确认修改
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
import { getCurrentInstance, watch } from "@vue/runtime-core";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const state = reactive({
  currencyList: [],
});
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: {},
  },
});
const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
  c_index: [{ required: true, message: "请输入序号", trigger: "blur" }],
  name: [{ required: true, message: "请输入名字", trigger: "blur" }],
  symbol_id: [{ required: true, message: "请选择币种K线", trigger: "blur" }],
  text: [{ required: true, message: "请输入币种中文名", trigger: "blur" }],
  imageUrl: [{ required: true, message: "请上传图标", trigger: "blur" }],
  // deposit: [{ required: true, message: "请输入价格", trigger: "blur" }],
  // term_type: [{ required: true, message: "请选择期限类型", trigger: "blur" }],
  // term_value: [{ required: true, message: "请输入期限", trigger: "blur" }],
  is_profit: [{ required: true, message: "请输入盈利类型", trigger: "blur" }],
  min_profit_percent: [
    { required: true, message: "请输入最小收益率", trigger: "blur" },
  ],
  max_profit_percent: [
    { required: true, message: "请输入最大收益率", trigger: "blur" },
  ],
  min_loss_percent: [
    { required: true, message: "请输入最小亏损率", trigger: "blur" },
  ],
  max_loss_percent: [
    { required: true, message: "请输入最大亏损率", trigger: "blur" },
  ],
  fee_percent: [{ required: true, message: "请输入手续费", trigger: "blur" }],
  is_open: [{ required: true, message: "", trigger: "blur" }],
  // profit_show: [{ required: true, message: "请输入展示收益", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: 0,
  c_index: "",
  name: "",
  symbol_id: "",
  text: "",
  imageUrl: "",
  deposit: "",
  term_type: "",
  term_value: "",
  is_profit: "",
  is_open: false,
  min_profit_percent: "",
  max_profit_percent: "",
  min_loss_percent: "",
  max_loss_percent: "",
  fee_percent: "",
  profit_show: "",
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

onMounted(() => {
  getNonCurrencyList();
});

const getNonCurrencyList = () => {
  $api.currency.getNonCurrencyList({}).then((res) => {
    state.currencyList = res.data;
  });
};

watch(
  () => props.info,
  (val) => {
    form.id = val.id;
    form.c_index = val.c_index;
    form.name = val.name;
    form.symbol_id = val.symbol_id;
    form.text = val.text;
    form.imageUrl = val.imageUrl;

    form.deposit = val.deposit;
    form.term_type = val.term_type;
    form.term_value = val.term_value;
    form.is_profit = val.is_profit;
    form.min_profit_percent = val.min_profit_percent;

    form.max_profit_percent = val.max_profit_percent;
    form.min_loss_percent = val.min_loss_percent;
    form.max_loss_percent = val.max_loss_percent;
    form.fee_percent = val.fee_percent;
    form.profit_show = val.profit_show;
    form.is_open = val.is_open;

    console.log("val:", val);
  },
  {
    immediate: true,
    deep: true,
  }
);
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;
      $api.currency
        .editCurrency(form)
        .then((res) => {
          console.log("form", res);
          if (res.result) {
            ElMessage({
              showClose: true,
              message: "编辑成功",
            });
            emit("updateList");
            emit("closeModal");
          }
        })
        .finally(() => {
          editLoading.value = false;
        });
      // 此处暂时省去异步接口处理
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

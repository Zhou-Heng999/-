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
        label-width="200px"
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

        <el-form-item label="货币币种" prop="symbol_id">
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

        <el-form-item label="展示收益率" prop="show_percent">
          <el-input
            v-model="form.show_percent"
            placeholder="请输入展示收益率"
          ></el-input>
        </el-form-item>

        <el-divider content-position="left">开仓设置</el-divider>
        <el-form-item label="手续费(%)" prop="open_fee_percent">
          <el-input
            v-model="form.open_fee_percent"
            placeholder="请输入手续费"
          ></el-input>
        </el-form-item>
        <el-form-item label="1张数量" prop="open_fee_percent">
          <el-input
            v-model="form.count_value"
            placeholder="请输入1张对应的币数量"
          ></el-input>
        </el-form-item>

        <!--<el-divider content-position="left">日常价格设置</el-divider>-->
        <!--<el-form-item label="初始价格(USDT)" prop="init_price">-->
        <!--<el-input v-model="form.init_price" placeholder="请输入初始价格(USDT)"></el-input>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="实际价格变动范围(USDT)" prop="price">-->
        <!--<div class='flex' >-->
        <!--<el-input v-model="form.min_price" placeholder=""></el-input>- -->
        <!--<el-input v-model="form.max_price" placeholder=""></el-input>-->
        <!--</div>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="每次变动价格浮动(%)" prop="percent">-->
        <!--<div class='flex' >-->
        <!--<el-input v-model="form.min_percent" placeholder=""></el-input>- -->
        <!--<el-input v-model="form.max_percent" placeholder=""></el-input>-->
        <!--</div>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="频率单位" prop="change_type">-->
        <!--<el-radio-group v-model="form.change_type">-->
        <!--<el-radio label="1" size="large">秒</el-radio>-->
        <!--<el-radio label="2" size="large">分钟</el-radio>-->
        <!--<el-radio label="3" size="large">小时</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="价格变动频率" prop="change_value">-->
        <!--<el-input v-model="form.change_value" placeholder="请输入价格变动频率" />-->
        <!--</el-form-item>-->

        <!--<el-divider content-position="left">看涨/跌价格设置</el-divider>-->
        <!--<el-form-item label="开仓-看涨价(USDT)" prop="open_rise_price">-->
        <!--<div class='flex' >-->
        <!--<el-input v-model="form.open_rise_price" placeholder=""></el-input>- -->
        <!--<el-input v-model="form.open_rise_price_max" placeholder=""></el-input>-->
        <!--</div>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="开仓-看跌价(USDT)" prop="open_fall_price">-->
        <!--<div class='flex' >-->
        <!--<el-input v-model="form.open_fall_price" placeholder=""></el-input>- -->
        <!--<el-input v-model="form.open_fall_price_max" placeholder=""></el-input>-->
        <!--</div>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="涨跌价格开关" prop="term_value">-->
        <!--<el-switch v-model="form.price_switch" />-->
        <!--</el-form-item>-->

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

const check_rules = (rule, value, cb) => {
  if (form.open_fall_price == "" || form.open_fall_price_max == "") {
    cb(new Error("不能为空"));
  } else {
    cb();
  }
};

const rules = {
  c_index: [{ required: true, message: "不能为空", trigger: "blur" }],
  name: [{ required: true, message: "不能为空", trigger: "blur" }],
  symbol_id: [{ required: true, message: "不能为空", trigger: "blur" }],
  text: [{ required: true, message: "不能为空", trigger: "blur" }],
  imageUrl: [{ required: true, message: "不能为空", trigger: "blur" }],
  show_percent: [{ required: true, message: "不能为空", trigger: "blur" }],
  open_fee_percent: [{ required: true, message: "不能为空", trigger: "blur" }],
  // init_price: [{ required: true, message: "不能为空", trigger: "blur" }],
  // price: [{ validator:check_rules, trigger: "blur" }],
  // percent: [{ validator:check_rules, trigger: "blur" }],
  // change_type: [{ required: true, message: "不能为空", trigger: "blur" }],
  // change_value: [{ required: true, message: "不能为空", trigger: "blur" }],
  // open_rise_price: [{ validator:check_rules, trigger: "blur" }],
  // open_fall_price: [{ validator:check_rules, trigger: "blur" }],
  // price_switch: [{ required: true, message: "不能为空", trigger: "blur" }],
  // count_value: [{ required: true, message: "不能为空", trigger: "blur" }],
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
  show_percent: "",
  open_fee_percent: "",
  init_price: "",
  min_price: "",
  max_price: "",
  min_percent: "",
  max_percent: "",
  change_type: "",
  change_value: "",
  open_rise_price: "",
  open_rise_price_max: "",
  open_fall_price: "",
  open_fall_price_max: "",
  count_value: "",
  price_switch: true,
});
const state = reactive({
  currencyList: [],
});
const fileList = ref([]);
const uploadLoading = ref(false);
const imgeUrl = ref("");
const uploadAd = (content) => {
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
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
  $api.currency.getNonCurrencyList({}).then((res) => {
    state.currencyList = res.data;
  });
};

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.contract
        .addContract(form)
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

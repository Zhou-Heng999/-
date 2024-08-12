<template>
  <el-dialog
    v-model="props.addVisible"
    @close="emit('closeModal')"
    width="1200px"
    title="编辑指数产品"
    label-width="300px"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        class="form-line"
        :model="form"
        :rules="rules"
        :inline="true"
      >
        <p class="mb20">
          指数ID填写规范,例: 上证指数为“sh + 股票代码”深圳指数为“sz + 股票代码
        </p>
        <el-form-item label="指数名称" prop="name">
          <el-input
            style="width: 190px"
            v-model="form.name"
            placeholder="请输入指数名称"
          />
        </el-form-item>

        <el-form-item label="指数代码" prop="code">
          <el-input
            style="width: 190px"
            v-model="form.code"
            placeholder="请输入指数代码"
          />
        </el-form-item>
        <el-form-item label="指数ID" prop="index_id">
          <el-input
            style="width: 190px"
            v-model="form.index_id"
            placeholder="请输入指数ID"
          />
        </el-form-item>
        <p class="mb20">
          该指数交易规则的设置信息请根据您的设置仿照示例填写,价格单位为元,数量单位为手
        </p>
        <el-form-item label="每手保证金" prop="deposit">
          <el-input
            style="width: 190px"
            v-model="form.deposit"
            placeholder="每手保证金(例:10000)"
          />
        </el-form-item>
        <el-form-item label="双边手续费" prop="fee">
          <el-input
            style="width: 190px"
            v-model="form.fee"
            placeholder="双边手续费(例:200)"
          />
        </el-form-item>
        <el-form-item label="每点浮动价" prop="float_price">
          <el-input
            style="width: 190px"
            v-model="form.float_price"
            placeholder="每点浮动价(例:300)"
          />
        </el-form-item>
        <el-form-item label="最大买入手数" prop="max_buy">
          <el-input
            style="width: 190px"
            v-model="form.max_buy"
            placeholder="最大买入手数(例:200)"
          />
        </el-form-item>
        <el-form-item label="最小买入手数" prop="min_buy">
          <el-input
            style="width: 190px"
            v-model="form.min_buy"
            placeholder="最小买入手数(例:1)"
          />
        </el-form-item>
        <el-form-item label="是否可交易" prop="status">
          <el-select
            style="width: 190px"
            v-model="form.status"
            placeholder="是否可交易"
          >
            <el-option
              v-for="item in $getTypeOption('TRADING_STATUS')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否首页显示" prop="index_show">
          <el-select v-model="form.index_show" placeholder="是否首页显示">
            <el-option
              v-for="item in $getTypeOption('STOCK_SHOW')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否列表页显示" prop="list_show">
          <el-select
            style="width: 190px"
            v-model="form.list_show"
            placeholder="是否列表页显示"
          >
            <el-option
              v-for="item in $getTypeOption('STOCK_SHOW')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex-center max-wdith">
        <el-button
          size="small"
          type="primary"
          :loading="addLoading"
          @click="submitForm()"
        >
          <i class="fa fa-plus"> </i> 确认修改
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
const { $api, $imgeUrl } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object || null,
    default: null,
  },
});

const addLoading = ref(false);
const rules = {
  code: [{ required: true, message: "请选择", trigger: "blur" }],
  name: [{ required: true, message: "请输入", trigger: "blur" }],
  index_id: [{ required: true, message: "请输入", trigger: "blur" }],
  deposit: [{ required: true, message: "请输入", trigger: "blur" }],
  fee: [{ required: true, message: "请输入", trigger: "blur" }],
  float_price: [{ required: true, message: "请输入", trigger: "blur" }],
  max_buy: [{ required: true, message: "请输入", trigger: "blur" }],
  min_buy: [{ required: true, message: "请输入", trigger: "blur" }],
  index_show: [{ required: true, message: "请输入", trigger: "blur" }],
  list_show: [{ required: true, message: "请输入", trigger: "blur" }],

  status: [{ required: true, message: "请输入", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  code: "",
  name: "",
  index_id: "",
  deposit: "",
  fee: "",
  float_price: "",
  max_buy: "",
  min_buy: "",
  index_show: "",
  list_show: "",
  status: "",
});

watch(
  props.info,
  (val) => {
    for (let i in form) {
      form[i] = val[i] + "";
    }
    console.log(11, val);
  },
  {
    immediate: true,
  }
);
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      $api.number
        .edit(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "编辑成功",
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
<style lang="scss">
.form-line .el-form-item__label {
  width: 120px !important;
}
</style>

<template>
  <el-dialog
    v-model="props.addVisible"
    @close="emit('closeModal')"
    width="500px"
    title="编辑股票"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="150px"
      >
        <el-form-item label="地区/国家" prop="stock_type">
          <el-select v-model="form.stock_type" placeholder="请选择地区/国家">
            <el-option
              v-for="item in $getTypeOption('STOCK_TYPE')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标的代码" prop="plate">
          <el-select v-model="form.plate" placeholder="请选择标的代码">
            <el-option
              v-for="item in form.stock_type
                ? $getTypeOption(
                    $getTypeOption('STOCK_TYPE')[form.stock_type].remark
                  )
                : []"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="股票名称" prop="name">
          <el-input
            style="width: 190px"
            v-model="form.name"
            placeholder="请输入股票名称"
          />
        </el-form-item>

        <el-form-item label="股票代号" prop="code">
          <el-input
            style="width: 190px"
            v-model="form.code"
            placeholder="请输入股票代号"
          />
        </el-form-item>
        <el-form-item label="是否可融资" prop="is_finance">
          <el-select v-model="form.is_finance" placeholder="请选择">
            <el-option
              v-for="item in $getTypeOption('FINANCE_TYPE')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="科创板股票" prop="kc_stock">
          <el-select v-model="form.kc_stock">
            <el-option
              v-for="item in $getTypeOption('SURE_TYPE')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="显示状态" prop="is_show">
          <el-select v-model="form.is_show">
            <el-option
              v-for="item in $getTypeOption('STOCK_SHOW')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="股票状态" prop="status">
          <el-select v-model="form.status">
            <el-option
              v-for="item in $getTypeOption('STOCK_PAY_STUTAS')"
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
          确认修改
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
const { $api, $imgeUrl, $getTypeOption } =
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
  plate: [{ required: true, message: "请输入", trigger: "blur" }],
  stock_type: [{ required: true, message: "请输入", trigger: "blur" }],

  code: [{ required: true, message: "请选择", trigger: "blur" }],
  // name: [{ required: true, message: "请输入", trigger: "blur" }],
  // kc_stock: [{ required: true, message: "请输入", trigger: "blur" }],
  // is_show: [{ required: true, message: "请输入", trigger: "blur" }],
  // status: [{ required: true, message: "请输入", trigger: "blur" }],
  // currency: [{ required: true, message: "请输入", trigger: "blur" }],
  // is_finance: [{ required: true, message: "请输入", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  plate: "",
  code: "",
  name: "",
  stock_type: "",
  kc_stock: "",
  is_show: "",
  status: "",
  region: "",
  currency: "",
  is_finance: "",
});
watch(
  props.info,
  (val) => {
    for (let i in form) {
      form[i] = val[i] + "";
    }
  },
  {
    immediate: true,
  }
);
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.region = $getTypeOption(
        $getTypeOption("STOCK_TYPE")[form.stock_type].remark
      )[form.plate].remark;
      $api.stock
        .edit(form)
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
<style lang="scss" scoped></style>

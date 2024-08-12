<template>
  <el-dialog
    v-model="props.addVisible"
    width="800px"
    @close="emit('closeModal')"
    title="编辑产品"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="200px"
      >
          <el-form-item label="序号" prop="p_index">
            <el-input
              v-model="form.p_index"
              placeholder="请输入序号"
            ></el-input>
          </el-form-item>

          <el-form-item label="矿池名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入矿池名称" />
          </el-form-item>

          <el-form-item label="质押币种" prop="stake_symbol_id">
            <el-select v-model="form.stake_symbol_id" defaultSelect="form.stake_symbol_id">
              <el-option
                v-for="item in state.currencyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="挖矿期限(天)" prop="stake_time">
            <el-input v-model="form.stake_time" placeholder="请输入挖矿期限" />
          </el-form-item>

          <el-form-item label="单人可持最大数量" prop="max_quantity">
            <el-input v-model="form.max_quantity" placeholder="请输入单人可持最大数量" />
          </el-form-item>

          <el-form-item label="可总质押数量" prop="total_quantity">
            <el-input v-model="form.total_quantity" placeholder="请输入可总质押数量" />
          </el-form-item>

          <el-form-item label="挖矿日化率(%)" prop="rate">
            <el-input v-model="form.rate" placeholder="请输入收益" />
          </el-form-item>

          <el-form-item label="盈利亏损" prop="profit_type">
            <el-radio-group v-model="form.profit_type">
              <el-radio label="0" size="large">亏损</el-radio>
              <el-radio label="1" size="large">盈利</el-radio>
              <el-radio label="2" size="large">偶盈偶亏</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="收益率(%)" prop="username">
            <div class='flex' >
              <el-input v-model="form.min_win_rate" placeholder="请输入最小收益率"></el-input>-
              <el-input v-model="form.max_win_rate" placeholder="请输入最大收益率"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="亏损率(%)" prop="username">
            <div class='flex' >
              <el-input v-model="form.min_loss_rate" placeholder="请输入最小亏损率"></el-input>-
              <el-input v-model="form.max_loss_rate" placeholder="请输入最大亏损率"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="产品描述" prop="desc">
            <el-input
              v-model="form.desc"
              :rows="10"
              type="textarea"
              placeholder="请输入产品描述"
            />
          </el-form-item>

        <el-row class="btn-container">
          <el-button
            size="small"
            type="primary"
            :loading="addLoading"
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
import {
  onMounted,
} from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
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
});
const state = reactive({
  currencyList:[]
})
const addVisible = ref(true);
const editLoading = ref(false);
const rules = {
  p_index: [{ required: true, message: "请输入序号", trigger: "blur" }],
  name: [{ required: true, message: "请输入名字", trigger: "blur" }],
  min_num: [{ required: true, message: "请输入", trigger: "blur" }],
  stake_symbol_id: [{ required: true, message: "请选择", trigger: "blur" }],
  price: [{ required: true, message: "请输入购买价格", trigger: "blur" }],
  rate: [{ required: true, message: "请输入收益", trigger: "blur" }],
  term_type: [{ required: true, message: "请输入挖矿期限单位", trigger: "blur" }],
  stake_time: [{ required: true, message: "请输入挖矿期限", trigger: "blur" }],
  max_quantity: [{ required: true, message: "请输入最大持有数量", trigger: "blur" }],
  total_quantity: [{ required: true, message: "请输入", trigger: "blur" }],
  desc: [{ required: true, message: "请输入", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id : "",
  p_index: "",
  name: "",
  stake_symbol_id: "",
  stake_time: "",
  max_quantity: "",
  total_quantity: "",
  rate: "",
  profit_type: "",
  min_win_rate: "",
  max_win_rate: "",
  min_loss_rate: "",
  max_loss_rate: "",
  desc: "",
});

watch(
  () => props.info,
  (val) => {
    let { id, p_index, name, stake_symbol_id, stake_time, max_quantity, total_quantity, rate,
      stype, min_win_rate, max_win_rate, min_loss_rate, max_loss_rate, desc } = val;

    form.id = id;
    form.p_index = p_index;
    form.name = name
    form.stake_symbol_id = stake_symbol_id;
    form.stake_time = stake_time;
    form.max_quantity = max_quantity;
    form.profit_type = String(stype);
    form.total_quantity = total_quantity;
    form.max_quantity = max_quantity;
    form.rate = rate;
    form.min_win_rate = min_win_rate
    form.max_win_rate = max_win_rate;
    form.min_loss_rate = min_loss_rate;
    form.max_loss_rate = max_loss_rate;
    form.desc = desc;
    console.log("editInfo", form);
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  getNonCurrencyList();
});

const getNonCurrencyList = () => {
  $api.currency
    .getNonCurrencyList({})
    .then((res) => {
      state.currencyList = res.data;
    });
};

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;

      $api.pool
        .editProduct(form)
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

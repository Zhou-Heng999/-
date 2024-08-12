<template>
  <el-dialog
    v-model="props.addVisible"
    @close="emit('closeModal')"
    width="500px"
    title="添加新股"
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
        <el-form-item label="最大购买数量" prop="code">
          <el-input
            style="width: 190px"
            v-model="form.max_count"
            placeholder="请输入最大购买数量"
          />
        </el-form-item>
        <el-form-item label="最大购买数量" prop="code">
          <el-input
            style="width: 190px"
            v-model="form.max_count"
            placeholder="请输入最大购买数量"
          />
        </el-form-item>
        <el-form-item label="最低申购数量" prop="min_count">
          <el-input
            style="width: 190px"
            v-model="form.min_count"
            placeholder="请输入最低申购数量"
          />
        </el-form-item>
        <el-form-item label="申购价格" prop="price">
          <el-input
            style="width: 190px"
            v-model="form.price"
            placeholder="请输入申购价格"
          />
        </el-form-item>
        <el-form-item label="行业市盈率" prop="hy_pe_ratio">
          <el-input
            style="width: 190px"
            v-model="form.hy_pe_ratio"
            placeholder="请输入行业市盈率"
          />
        </el-form-item>
        <el-form-item label="发行市盈率" prop="fh_pe_ratio">
          <el-input
            style="width: 190px"
            v-model="form.fh_pe_ratio"
            placeholder="请输入发行市盈率"
          />
        </el-form-item>
        <!-- <el-form-item label="新股模式" prop="newshares_model">
          <el-select v-model="form.newshares_model">
            <el-option
              v-for="item in $getTypeOption('NEW_SHARES_MODEL')"
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

        <el-form-item label="申购时间" prop="bug_at">
          <el-date-picker
            v-model="form.bug_at"
            type="datetime"
            placeholder="Select date and time"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="配号时间" prop="allotment_time">
          <el-date-picker
            v-model="form.allotment_time"
            type="datetime"
            placeholder="Select date and time"
            value-format="x"
          />
        </el-form-item>

        <el-form-item label="中签时间" prop="winning_time">
          <el-date-picker
            v-model="form.winning_time"
            type="datetime"
            placeholder="Select date and time"
            value-format="x"
          />
        </el-form-item>

        <el-form-item label="上市时间" prop="market_time">
          <el-date-picker
            v-model="form.market_time"
            type="datetime"
            placeholder="Select date and time"
            value-format="x"
          />
        </el-form-item>
      </el-form>
      <div class="flex-center max-wdith">
        <el-button
          size="small"
          type="primary"
          :loading="addLoading"
          @click="submitForm()"
        >
          <i class="fa fa-plus"> </i> 确认添加
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted } from "vue";
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
});

const addLoading = ref(false);
const rules = {
  code: [{ required: true, message: "请选择", trigger: "blur" }],
  name: [{ required: true, message: "请输入", trigger: "blur" }],
  stock_type: [{ required: true, message: "请输入", trigger: "blur" }],
  is_show: [{ required: true, message: "请输入", trigger: "blur" }],
  status: [{ required: true, message: "请输入", trigger: "blur" }],
  newshares_model: [{ required: true, message: "请输入", trigger: "blur" }],
  bug_at: [{ required: true, message: "请输入", trigger: "blur" }],
  allotment_time: [{ required: true, message: "请输入", trigger: "blur" }],
  winning_time: [{ required: true, message: "请输入", trigger: "blur" }],

  max_count: [{ required: true, message: "请输入", trigger: "blur" }],
  plate: [{ required: true, message: "请输入", trigger: "blur" }],
  currency: [{ required: true, message: "请输入", trigger: "blur" }],
  min_count: [{ required: true, message: "请输入", trigger: "blur" }],
  price: [{ required: true, message: "请输入", trigger: "blur" }],
  hy_pe_ratio: [{ required: true, message: "请输入", trigger: "blur" }],
  fh_pe_ratio: [{ required: true, message: "请输入", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  code: "",
  name: "",
  stock_type: "",
  is_show: "",
  max_count: "",
  newshares_model: "",
  bug_at: "",
  pay_at: "",
  plate: "",
  region: "",
  currency: "",
  market_time: "",
  winning_time: "",
  allotment_time: "",
  min_count: "",
  price: "",
  hy_pe_ratio: "",
  fh_pe_ratio: "",
});
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.region = $getTypeOption(
        $getTypeOption("STOCK_TYPE")[form.stock_type].remark
      )[form.plate].remark;
      let {
        bug_at,
        pay_at,
        winning_time,
        allotment_time,
        market_time,
        ...pramas
      } = form;
      $api.newshares
        .add({
          ...pramas,
          bug_at: bug_at / 1000,
          allotment_time: allotment_time / 1000,
          pay_at: pay_at / 1000,
          market_time: market_time / 1000,
          winning_time: winning_time / 1000,
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
<style lang="scss" scoped></style>

<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="赔付"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="120px"
      >

      <el-form-item label="币种" prop="symbol_id">
          <el-select v-model="form.symbol_id">
            <el-option
              v-for="item in props.symbolList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
      </el-form-item>

      <el-form-item label="卖出时间段" prop="sell_time">
        <el-date-picker
          v-model="form.sell_time"
          format="YYYY/MM/DD HH:mm:ss"
          type="datetimerange"
          unlink-panels
          range-separator="To"
          :shortcuts="shortcuts"
          value-format="x"
        />
      </el-form-item>

      <el-form-item label="赔付金额(USDT)" prop="peifu">
        <el-input v-model="form.peifu" placeholder="请输入赔付金额(USDT)" />
      </el-form-item>

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
  symbolList : [],
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  symbol_id: [{ required: true, message: "请选择币种", trigger: "blur" }],
  sell_time: [{ required: true, message: "请选择赔付订单时间段", trigger: "blur" }],
  peifu: [{ required: true, message: "请输入赔付金额", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  symbol_id: "",
  sell_time: [],
  peifu: "",
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.speed
        .orderCompensation({
          symbol_id: form.symbol_id,
          start_time: form.sell_time[0],
          end_time: form.sell_time[1],
          peifu: form.peifu,
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

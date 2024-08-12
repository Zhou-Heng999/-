<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="添加税率"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="原币种" prop="from_cid">
           <el-select v-model="form.from_cid">
            <el-option
              v-for="item in props.tagData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="兑换币种" prop="to_cid">
           <el-select v-model="form.to_cid">
            <el-option
              v-for="item in props.tagData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="买入价" prop="buy">
          <el-input v-model="form.buy" type="buy" placeholder="请输入买入价" />
        </el-form-item>
        <el-form-item label="卖出价" prop="sell">
          <el-input v-model="form.sell" type="sell" placeholder="请输入卖出价" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="editLoading"
            type="primary"
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
  tagData: {
    type: Array,
    default: [],
  },
});
const addLoading = ref(false);
const addVisible = ref(true);
const rules = {
  from_cid: [{ required: true, message: "请输入原币种", trigger: "blur" }],
  to_cid: [{ required: true, message: "请输入兑换币种", trigger: "blur" }],
  buy: [{ required: true, message: "请输入买入", trigger: "blur" }],
  sell: [{ required: true, message: "请输入卖出", trigger: "blur" }],
  status: [{ required: true, message: "请输入状态", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  from_cid: "",
  to_cid: "",
  buy: "",
  sell: "",
  status: null,
});
const statusData = ref([
  {
    id:0,
    name:'上架'
  },
  {
    id:1,
    name:'下架'
  }
]);
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      $api.rate
        .add(form)
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
<style lang="scss" scoped>.el-select {
  flex: 1;
}</style>

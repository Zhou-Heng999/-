<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑税率"
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
          <el-input
            v-model="form.sell"
            type="sell"
            placeholder="请输入卖出价"
          />
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
            <i class="fa fa-plus"> </i> 确认编辑
          </el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
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
  roleData: [],
  tagData:[]
});
const addVisible = ref(true);
const editLoading = ref(false);
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
const rules = {
  username: [{ required: true, message: "请输入用户账户", trigger: "blur" }],
  nick: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  code: [{ required: true, message: "请输入谷歌验证码", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: null,
  from_currency: null,
  from_tag: null,
  to_currency: null,
  to_tag: null,
  buy: null,
  sell: null,
  to_cid: null,
  from_cid: null,
});

watch(
  () => props.info,
  (val) => {
    let { id, from_currency, from_tag, to_currency,to_tag,buy,sell ,to_cid,from_cid,status} = val;
    form.id = id;
    form.from_currency = from_currency;
    form.from_tag = from_tag;
    form.to_currency = to_currency;
    form.to_tag = to_tag;
    form.buy = buy;
    form.sell = sell;
    form.to_cid = to_cid;
    form.from_cid = from_cid;
    form.status = status;
    console.log("editInfo", val);
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

      $api.rate
        .edit(form)
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
.el-select {
  flex: 1;
}
</style>

<template>
  <div class="table-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="280px"
      style="width: 900px"
    >
      <div class="flex">
        <el-form-item label="一级代理返佣费率(%)：" prop="commission1percent">
          <el-input v-model="form.commission1percent" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="一级代理获得积分比例(%)：" prop="jf1percent">
          <el-input v-model="form.jf1percent" placeholder=""></el-input>
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item label="二级代理返佣费率(%)：" prop="commission2percent">
          <el-input v-model="form.commission2percent" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="二级代理获得积分比例(%)：" prop="jf2percent">
          <el-input v-model="form.jf2percent" placeholder=""></el-input>
        </el-form-item>
      </div>

      <div class="flex">
        <el-form-item label="三级代理返佣费率(%)：" prop="commission3percent">
          <el-input v-model="form.commission3percent" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="三级代理获得积分比例(%)：" prop="jf3percent">
          <el-input v-model="form.jf3percent" placeholder=""></el-input>
        </el-form-item>
      </div>

      <div class="flex">
        <el-form-item label="用户当天操作产品低于（USDT)：" prop="limitpercent">
          <el-space>
            <el-input v-model="form.day_usdt" placeholder=""></el-input>
            <span>只能获得</span>
            <el-input v-model="form.limitpercent" placeholder=""></el-input>
            <span>返佣费率(%)</span>
          </el-space>
        </el-form-item>
        <!-- <el-form-item label="只能获得" prop="commission1Percent">
          <div class="flex">
            <el-input
              v-model="form.commission1Percent"
              placeholder=""
            ></el-input>
            <span>返佣费率(%)</span>
          </div>
        </el-form-item> -->
      </div>

      <el-form-item label="代理说明:" prop="des">
        <el-input v-model="form.proxy_des" type="textarea" rows="5"></el-input>
      </el-form-item>

      <el-form-item label="商品兑换说明:" prop="des">
        <el-input v-model="form.shop_des" type="textarea" rows="5"></el-input>
      </el-form-item>

      <!-- 无限代 -->
      <!-- <el-form-item label="一级代理返佣费率(%)：" prop="commission1Percent">
        <el-input v-model="form.commission1Percent" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="无限代理返佣费率(%)：" prop="commission2Percent">
        <el-input v-model="form.commission2Percent" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="无限代理配置："></el-form-item>
      <el-form-item label="直推数量：" prop="subNum">
        <el-input v-model="fateInfo.subNum" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="盈利返佣：" prop="profit">
        <el-input v-model="fateInfo.profit" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="团队人数：" prop="teamNum">
        <el-input v-model="fateInfo.teamNum" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="说明：" prop="des">
        <el-input v-model="form.des" type="textarea" rows="5"></el-input>
      </el-form-item> -->

      <el-row class="flex-center" style="margin-top: 75px">
        <el-button type="primary" :loading="addLoading" @click="submitForm()">
          <i class="fa fa-plus"> </i> 保存
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const addLoading = ref(false);
const formRef = ref();
const form = reactive({
  commission1percent: "",
  commission2percent: "",
  commission3percent: "",
  jf1percent: "",
  jf2percent: "",
  jf3percent: "",
  limitpercent: "",
  day_usdt: "",
  proxy_des: "",
  shop_des: "",

  fateInfo_json: "",
  des: "",
});
const fateInfo = reactive({
  subNum: "",
  profit: "",
  teamNum: "",
});
const rules = {
  commission1percent: [{ required: true, message: "请输入", trigger: "blur" }],
  commission2percent: [{ required: true, message: "请输入", trigger: "blur" }],
  commission3percent: [{ required: true, message: "请输入", trigger: "blur" }],
  jf1percent: [{ required: true, message: "请输入", trigger: "blur" }],
  jf2percent: [{ required: true, message: "请输入", trigger: "blur" }],
  jf3percent: [{ required: true, message: "请输入", trigger: "blur" }],
  limitpercent: [{ required: true, message: "请输入", trigger: "blur" }],
  day_usdt: [{ required: true, message: "请输入", trigger: "blur" }],
};

onMounted(() => {
  getProxyInfo();
});

// methods
const getProxyInfo = () => {
  $api.setting.getProxyInfo().then((res) => {
    console.log("getProxyInfo", res);
    for (let i in form) {
      form[i] = res.data[i];
    }
    if (res.data.fateInfo_json) {
      let _d = JSON.parse(res.data.fateInfo_json);
      fateInfo.subNum = _d.subNum;
      fateInfo.profit = _d.profit;
      fateInfo.teamNum = _d.teamNum;
    }
  });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      form.fateInfo_json = JSON.stringify(fateInfo);
      addLoading.value = true;
      $api.setting
        .saveProxyInfo(form)
        .then((res) => {
          if (res.result) {
            ElMessage({
              type: "success",
              showClose: true,
              message: "保存成功",
            });
            getProxyInfo();
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
.table-container {
  display: flex;
  justify-content: center;
  .form-inline {
    margin: 15px;
    text-align: left;
  }
  .table-list {
    margin: 15px;
  }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
</style>

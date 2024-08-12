<template>
  <div class="table-container">
    <el-tabs
      v-model="activeName"
      type="card"
      class="card-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="充值" name="t1">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="350px"
          style="width: 700px"
        >
          <el-form-item label="状态：" prop="isOpen">
            <el-switch v-model="form.isOpen" />
          </el-form-item>
           <el-form-item label="选择用户：" prop="address">
            <el-select
              v-model="form.address"
              :placeholder="'选择'"
              @change="choseBank"
            >
              <el-option
                :key="index"
                :label="u.selectName"
                :value="u.id"
                v-for="(u, index) in bankInfoList"
              >{{u.selectName}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充值平台：" prop="payPlatformType">
            <el-select v-model="form.payPlatformType" placeholder="充值平台">
              <el-option label="银行卡支付" value="1" />
            </el-select>
          </el-form-item>
           <el-form-item label="选择：" prop="id">
            <el-select v-model="form.id" placeholder="充值平台">
              <el-option label="银行卡支付" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="金额最小/最大：" prop="otherMin">
            <el-input v-model="form.otherMin" style="width: 100px" />
            -
            <el-input v-model="form.otherMax" style="width: 100px" />
          </el-form-item>
          <el-form-item label="手续费(%)：" prop="feePercent">
            <el-input v-model="form.feePercent" />
          </el-form-item>
          <el-form-item label="充值返佣(%)：" prop="minCommission">
            <el-input v-model="form.minCommission" style="width: 100px" />
            -
            <el-input v-model="form.maxCommission" style="width: 100px" />
          </el-form-item>
          <el-form-item label="充值间隔时间(分钟)：" prop="termValue">
            <el-input v-model="form.termValue" />
          </el-form-item>
          <el-form-item label="允许时间：" prop="rangeTime">
            <el-time-picker
              v-model="form.rangeTime"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
              value-format="x"
            />
          </el-form-item>
          <el-form-item label="温馨提示：" prop="tips">
            <el-input v-model="form.tips" type="textarea" :rows="10" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="提现" name="t2">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="350px"
          style="width: 700px"
        >
          <el-form-item label="状态：" prop="isOpen">
            <el-switch v-model="form.isOpen" />
          </el-form-item>
          <el-form-item label="金额最小/最大：" prop="otherMin">
            <el-input v-model="form.otherMin" style="width: 100px" />
            -
            <el-input v-model="form.otherMax" style="width: 100px" />
          </el-form-item>
          <el-form-item label="手续费(%)：" prop="feePercent">
            <el-input v-model="form.feePercent" />
          </el-form-item>
          <el-form-item label="充值未使用手续费(%)：" prop="feePercentMax">
            <el-input v-model="form.feePercentMax" />
          </el-form-item>
          <el-form-item label="每日可提现次数：" prop="count">
            <el-input v-model="form.count" />
          </el-form-item>
          <el-form-item label="提现间隔时间(分钟)：" prop="termValue">
            <el-input v-model="form.termValue" />
          </el-form-item>
          <el-form-item label="允许时间：" prop="rangeTime">
            <el-time-picker
              v-model="form.rangeTime"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
              value-format="x"
            />
          </el-form-item>
          <el-form-item label="温馨提示：" prop="tips">
            <el-input v-model="form.tips" type="textarea" :rows="10" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="币币充值" name="t3" v-if="false">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="350px"
          style="width: 700px"
        >
          <el-form-item label="状态：" prop="isOpen">
            <el-switch v-model="form.isOpen" />
          </el-form-item>
          <el-form-item label="金额最小/最大：" prop="otherMin">
            <el-input v-model="form.otherMin" style="width: 100px" />
            -
            <el-input v-model="form.otherMax" style="width: 100px" />
          </el-form-item>
          <el-form-item label="手续费(%)：" prop="feePercent">
            <el-input v-model="form.feePercent" />
          </el-form-item>
          <el-form-item label="TRC充币二维码：" prop="qrCode">
            <el-upload
              ref="trcRef"
              class="avatar-uploader"
              :limit="1"
              :show-file-list="false"
              name="img"
              :http-request="uploadAd"
              element-loading-text="图片上传中"
              v-loading="trcRefLoading"
            >
              <img
                v-if="form.qrCode"
                :src="$setImageUrl(form.qrCode)"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="TRC充币地址：" prop="address">
            <el-input v-model="form.address" />
          </el-form-item> -->

          <el-form-item label="BSC充币二维码：" prop="qrCode">
            <el-upload
              ref="bscRef"
              class="avatar-uploader"
              :limit="1"
              :show-file-list="false"
              name="img"
              :http-request="BSCuploadAd"
              element-loading-text="图片上传中"
              v-loading="uploadLoading"
            >
              <img
                v-if="form.bsc_qr_code"
                :src="$setImageUrl(form.bsc_qr_code)"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="BSC充币地址：" prop="address">
            <el-input v-model="form.bsc_address" />
          </el-form-item> -->
          <el-form-item label="充值间隔时间(分钟)：" prop="termValue">
            <el-input v-model="form.termValue" />
          </el-form-item>
          <el-form-item label="允许时间：" prop="rangeTime">
            <el-time-picker
              v-model="form.rangeTime"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
              value-format="x"
            />
          </el-form-item>
          <el-form-item label="温馨提示：" prop="tips">
            <el-input v-model="form.tips" type="textarea" :rows="10" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="币币提现" name="t4" v-if="false">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="350px"
          style="width: 700px"
        >
          <el-form-item label="状态：" prop="isOpen">
            <el-switch v-model="form.isOpen" />
          </el-form-item>
          <el-form-item label="金额最小/最大：" prop="otherMin">
            <el-input v-model="form.otherMin" style="width: 100px" />
            -
            <el-input v-model="form.otherMax" style="width: 100px" />
          </el-form-item>
          <el-form-item label="手续费(%)：" prop="feePercent">
            <el-input v-model="form.feePercent" />
          </el-form-item>
          <el-form-item label="充值未使用手续费(%)：" prop="feePercentMax">
            <el-input v-model="form.feePercentMax" />
          </el-form-item>
          <el-form-item label="每日可提现次数：" prop="count">
            <el-input v-model="form.count" />
          </el-form-item>
          <el-form-item label="提现间隔时间(分钟)：" prop="termValue">
            <el-input v-model="form.termValue" />
          </el-form-item>
          <el-form-item label="允许时间：" prop="rangeTime">
            <el-time-picker
              v-model="form.rangeTime"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
              value-format="x"
            />
          </el-form-item>
          <el-form-item label="温馨提示：" prop="tips">
            <el-input v-model="form.tips" type="textarea" :rows="10" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="银行" name="t5">
        <el-form
          ref="formRef5"
          :model="form5"
          :rules="rules5"
          label-width="400px"
          style="width: 700px"
        >
          <el-form-item label="选择：" prop="id">
            <el-select
              v-model="form5.id"
              placeholder="选择"
              @change="choseBank"
            >
              <el-option
                :value="u.id"
                :key="index"
                :label="u.selectName"
                v-for="(u, index) in bankInfoList"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号：" prop="name">
            <el-input v-model="form5.name" />
          </el-form-item>
          <el-form-item label="账号名字：" prop="account">
            <el-input v-model="form5.account" />
          </el-form-item>
          <el-form-item label="银行名字：" prop="bankName">
            <el-input v-model="form5.bankName" />
          </el-form-item>
          <el-form-item label="支行名字：" prop="subBankName">
            <el-input v-model="form5.subBankName" />
          </el-form-item>
          <el-form-item label="温馨提示：" prop="tips">
            <el-input v-model="form5.tips" type="textarea" :rows="10" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-row class="flex-center" style="margin-top: 50px">
    <el-button type="primary" :loading="addLoading" @click="submitForm()">
      <i class="fa fa-plus"> </i> 保存
    </el-button>
    <el-button
      type="danger"
      :loading="addLoading"
      v-if="activeName === 't5'"
      @click="delBankInfo"
    >
      <i class="fa fa-plus"> </i> 删除
    </el-button>
  </el-row>
</template>
<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const { $api, $imgeUrl } =
  getCurrentInstance().appContext.config.globalProperties;
const uploadLoading = ref(false);
const addLoading = ref(false);
const activeName = ref("t3");
const formRef = ref();
const formRef5 = ref();
const form = reactive({
  transType: "",
  isOpen: true,
  payPlatformType: "4",
  otherMin: "",
  otherMax: "",
  feePercent: "",
  feePercentMax: "",
  minCommission: "",
  maxCommission: "",
  termValue: "",
  count: "",
  rangeTime: "",
  startTime: "",
  endTime: "",
  qrCode: "",
  address: "1",
  bsc_qr_code: "",
  bsc_address: "",
  tips: "",
});
const form5 = reactive({
  id: "",
  name: "",
  account: "",
  bankName: "",
  subBankName: "",
  tips: "",
});
const rules = {
  isOpen: [{ required: true, message: "", trigger: "blur" }],
  otherMin: [{ required: true, message: "", trigger: "blur" }],
  feePercent: [{ required: true, message: "", trigger: "blur" }],
  rangeTime: [{ required: true, message: "", trigger: "blur" }],
  tips: [{ required: true, message: "", trigger: "blur" }],
};
const rules5 = {
  id: [{ required: true, message: "", trigger: "blur" }],
  name: [{ required: true, message: "", trigger: "blur" }],
  account: [{ required: true, message: "", trigger: "blur" }],
  bankName: [{ required: true, message: "", trigger: "blur" }],
  subBankName: [{ required: true, message: "", trigger: "blur" }],
  tips: [{ required: true, message: "", trigger: "blur" }],
};
const bankInfoList = ref([]);

const fileList = ref([]);
const trcRef = ref(null);
const trcRefLoading = ref(false);
const uploadAd = (content) => {
  let formData = new FormData();
  formData.append("img", content.file);
  trcRefLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      form.qrCode = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      trcRefLoading.value = false;
      trcRef.value.handleRemove(content.file);
    });
};

const BSCuploadAd = (content) => {
  let formData = new FormData();
  formData.append("img", content.file);
  uploadLoading.value = true;
  $api.parameter
    .uploadImg(formData)
    .then((res) => {
      console.log(res);
      form.bsc_qr_code = res.url;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      uploadLoading.value = false;
      console.log("bscRef.value", bscRef.value);
      bscRef.value.handleRemove(content.file);
    });
};

onMounted(() => {
  getTransTypeList({ transType: 3 });
});

// methods
const handleClick = (tab, event) => {
  activeName.value = tab.paneName;
  console.log(activeName.value);
  if (tab.paneName === "t1") {
    getTransTypeList({ transType: 1 });
    getBankInfoList();

  }
  if (tab.paneName === "t2") {
    getTransTypeList({ transType: 2 });
  }
  if (tab.paneName === "t3") {
    getTransTypeList({ transType: 3 });
  }
  if (tab.paneName === "t4") {
    getTransTypeList({ transType: 4 });
  }
  if (tab.paneName === "t5") {
    getBankInfoList();
  }
};

const choseBank = (id) => {
  console.log(id);
  for (let i in bankInfoList.value) {
    if (id == bankInfoList.value[i].id) {
      form5.id = bankInfoList.value[i].id;
      form5.name = bankInfoList.value[i].name;
      form5.account = bankInfoList.value[i].account;
      form5.bankName = bankInfoList.value[i].name;
      form5.subBankName = bankInfoList.value[i].subBankName;
      form5.tips = bankInfoList.value[i].tips;
    }
  }
};

const getTransTypeList = (param) => {
  $api.trans.get_trans_type(param).then((res) => {
    console.log("getTransTypeList", res);
    form.isOpen = res.data.isOpen;
    form.payPlatformType = res.data.payPlatformType;
    form.otherMin = res.data.otherMin;
    form.otherMax = res.data.otherMax;
    form.feePercent = res.data.feePercent;
    form.feePercentMax = res.data.feePercentMax;
    form.minCommission = res.data.minCommission;
    form.maxCommission = res.data.maxCommission;
    form.termValue = res.data.termValue;
    form.count = res.data.count;
    form.rangeTime = res.data.rangeTime;
    form.startTime = res.data.startTime;
    form.endTime = res.data.endTime;
    form.qrCode = res.data.qrCode;
    form.address = res.data.address;
    form.bsc_qr_code = res.data.bsc_qr_code;
    form.bsc_address = res.data.bsc_address;
    form.tips = res.data.tips;
  });
};
const bscRef = ref(null);
const handleSuccess = () => {
  console.log("1111");

  bscRef.value.clearFiles();
};
const getBankInfoList = () => {
  $api.trans.get_bank_info().then((res) => {
    bankInfoList.value = [];
    console.log("getBankInfoList", res);
    let _d = {
      id: 0,
      selectName: "新增",
      name: "",
      account: "",
      bankName: "",
      subBankName: "",
      tips: "银行卡转账，支付宝，微信，钱包地址支付，请认真确认商家信息后再进行转账支付，转账成功后请保留转账成功凭证，如有问题可以联系在线客服处理，（注！！请切勿保存商家信息进行私下转账（私下转账属于个人私下交易行为，与本平台无关造成损失由个人承担！）",
    };
    bankInfoList.value.push(_d);
    for (let i in res.data) {
      bankInfoList.value.push(res.data[i]);
    }
  });
};
const beforeAvatarUpload = (content) => {
  return true;
};
const delBankInfo = () => {
  console.log("form5", form5);
  addLoading.value = true;
  $api.trans
    .del_bank_info({ id: form5.id })
    .then((res) => {
      if (res.result) {
        ElMessage({
          type: "success",
          showClose: true,
          message: "删除成功",
        });
      }
    })
    .finally(() => {
      addLoading.value = false;
      choseBank(0);
      bankInfoList.value = [];
      getBankInfoList();
    });
};

const submitForm = () => {
  console.log(activeName.value);
  if (activeName.value === "t5") {
    formRef5.value.validate(async (valid) => {
      if (valid) {
        console.log("form5", form5);
        let _d = {
          id: form5.id,
          name: form5.name,
          account: form5.account,
          bankName: form5.bankName,
          subBankName: form5.subBankName,
          tips: JSON.stringify(form5.tips.split("\n")),
        };
        addLoading.value = true;
        $api.trans
          .edit_bank_info(_d)
          .then((res) => {
            if (res.result) {
              ElMessage({
                type: "success",
                showClose: true,
                message: "保存成功",
              });
            }
          })
          .finally(() => {
            addLoading.value = false;
            choseBank("0");
            bankInfoList.value = [];
            getBankInfoList();
          });
      }
    });
  } else {
    formRef.value.validate(async (valid) => {
      if (valid) {
        if (activeName.value === "t1") {
          form.transType = 1;
        }
        if (activeName.value === "t2") {
          form.transType = 2;
        }
        if (activeName.value === "t3") {
          form.transType = 3;
        }
        if (activeName.value === "t4") {
          form.transType = 4;
        }
        form.startTime = form.rangeTime[0] / 1000;
        form.endTime = form.rangeTime[1] / 1000;
        form.tips = JSON.stringify(form.tips.split("\n"));
        console.log("form", form);
        addLoading.value = true;
        $api.trans
          .edit_trans_type(form)
          .then((res) => {
            if (res.result) {
              ElMessage({
                type: "success",
                showClose: true,
                message: "保存成功",
              });
            }
          })
          .finally(() => {
            addLoading.value = false;
            getTransTypeList({ transType: form.transType });
          });
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.table-container {
  display: flex;
  justify-content: flex-start;
  .form-inline {
    margin: 15px;
    text-align: left;
  }
  .table-list {
    margin: 15px;
  }
  .card-tabs {
    padding: 10px 20px 0px 20px;
  }
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important;
}
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

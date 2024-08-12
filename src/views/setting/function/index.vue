<template>
  <div class="table-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="400px"
      style="width: 800px"
    >
      <div v-for="item in formList">
        <el-divider
          ><span style="color: #409eff">{{ item.title }}</span></el-divider
        >
        <el-form-item
          v-for="its in item.formItems"
          :label="its.label"
          :key="its.key"
        >
          <div class="flex" v-if="its.type === 'input'">
            <el-input
              v-model="its.val"
              autosize
              :type="its.subtype"
              :rows="4"
            >
            </el-input>
            <el-button
              style="margin:0 35px"
              type="primary"
              :loading="addLoading"
              @click="change(its.val, its.key,its.type)"
            >
              <i class="fa fa-plus"> </i> 保存
            </el-button>
          </div>

          <el-select v-model="its.val" v-if="its.type === 'select'">
            <el-option
              v-for="op in its.option"
              :key="op.id"
              :label="op.name"
              :value="op.id"
            />
          </el-select>
          <el-switch
            v-model="its.val"
            @change="change(its.val, its.key,its.type)"
            v-if="its.type === 'switch'"
          />
          <el-date-picker
            v-model="its.val"
            v-else-if="its.type === 'datetimerange'"
            format="YYYY/MM/DD HH:mm:ss"
            type="datetimerange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="shortcuts"
            value-format="x"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
  <!-- <el-row class="flex-center">
    <el-button type="primary" :loading="addLoading" @click="submitForm()">
      <i class="fa fa-plus"> </i> 保存
    </el-button>
  </el-row> -->
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from "vue";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const addLoading = ref(false);
const formRef = ref();
const form = reactive({});

const formList = reactive([
  {
    title: "功能配置",
    formItems: [
      // {
      //   label: "禁止群内发送定时消息",
      //   key: "forbid_normal_user_friend_each_other",
      //   type: "select",
      //   option: [
      //     { id: "1", name: "允许" },
      //     { id: "0", name: "不允许" },
      //   ],
      // },
      // {
      //   label: "用户注册必须上传头像:",
      //   key: "forbid_normal_user_friend_each_other",
      //   type: "switch",
      //   option: [
      //     { id: "1", name: "允许" },
      //     { id: "0", name: "不允许" },
      //   ],
      // },
      // {
      //   label: "特权用户是否可以编辑消息",
      //   key: "is_multi_leverage",
      //   type: "select",
      //   option: [
      //     { id: "1", name: "允许" },
      //     { id: "0", name: "不允许" },
      //   ],
      // },
      // {
      //   label: "单设备账号注册限制",
      //   key: "ios_url",
      //   type: "select",
      //   option: [
      //     { id: "1", name: "允许" },
      //     { id: "0", name: "不允许" },
      //   ],
      // },
      // {
      //   label: "客户端单一设备注册账号个数",
      //   key: "android_url",
      //   type: "input",
      // },
      // {
      //   label: "禁止普通用户添加普通用户",
      //   key: "android_url",
      //   type: "input",
      // },
      // {
      //   label: "禁止普通用户添加特权用户",
      //   key: "ios_url",
      //   type: "select",
      //   option: [
      //     { id: "1", name: "允许" },
      //     { id: "0", name: "不允许" },
      //   ],
      // },
      // {
      //   label: "禁止特权用户添加特权用户",
      //   key: "ios_url",
      //   type: "select",
      //   option: [
      //     { id: "1", name: "允许" },
      //     { id: "0", name: "不允许" },
      //   ],
      // },
      // {
      //   label: "客服联系方式",
      //   key: "android_url",
      //   type: "input",
      // },
    ],
  },
]);

const rules = {
  leverage_rate: [{ required: true, message: "请输入", trigger: "blur" }],
};

onMounted(() => {
  getSystem();
});

// methods
const getSystem = () => {
  $api.appSetting.list().then((res) => {
    let list = res.data.list;
    let a = {};
    list.forEach((item) => {
      if (item.type == 0) {
        a = {
          label: item.desc,
          key: item.key,
          type: "switch",
          val: item.val == "off" ? false : true,
        };
      } else if (item.type == 1) {
        a = {
          label: item.desc,
          key: item.key,
          val: item.val,
          type: "input",
        };
      }
      formList[0].formItems.push(a);
    });
    console.log(formList[0].formItems);
  });
};

const change = (val, key,type) => {
  console.log(val, key,  type);
  let a = {
    key: key,
    val: type == 'switch' ? val ? "on" : "off" : val,
  };
  $api.appSetting
    .set(a)
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
      formList[0].formItems = [];
      addLoading.value = false;
      getSystem();
    });
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log("form", form, Object.keys(form).length);
      addLoading.value = true;
      let result = Object.entries(form).map(([key, val]) => ({
        key,
        val: typeof val === "boolean" ? (val ? "on" : "off") : val,
      }));
      let a = JSON.stringify(result);
      // console.log(a);
      $api.appSetting
        .set({ result: a })
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
          formList[0].formItems = [];
          addLoading.value = false;
          getSystem();
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

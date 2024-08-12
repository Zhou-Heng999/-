<template>
  <div v-loading="loading" class="new">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <div style="color: red; margin-left: 20px">
        <p>前端按照此处先后顺序展示</p>
      </div>
      <div v-for="(item, index) in state.shop_type_list" :key="index">
        <el-divider
          ><span style="color: #409eff"
            >商品分类{{ index + 1 }}</span
          ></el-divider
        >
        <view
          class="flex flex-center"
          hover-class="none"
          hover-stop-propagation="false"
        >
          <el-form-item label="ID" prop="value">
            <el-input v-model="item.value" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="名字" prop="item_name">
            <el-input v-model="item.name" style="width: 300px">
              <template #append>
                <el-button
                  :icon="Remove"
                  @click="removeReward('shop_type_list', index)"
                  style="width: 100px"
                />
              </template>
            </el-input>
          </el-form-item>
        </view>
      </div>
      <div class="flex flex-center">
        <el-form-item label="" prop="memo">
          <el-button
            :icon="Plus"
            @click="addReward('shop_type_list')"
            style="width: 100px"
          />
        </el-form-item>
      </div>

      <div class="flex-center mb30">
        <el-button
          type="primary"
          :loading="addLoading"
          @click="submitForm('shop_type_list')"
        >
          <i class="fa fa-plus"> </i> 保存商品分类
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { Plus, Remove } from "@element-plus/icons-vue";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
console.log(getCurrentInstance().appContext.config.globalProperties);
const emit = defineEmits("closeModal", "updateList");
const props = defineProps({
  addVisible: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  getItemsTypeList();
});

const getBoxTypeList = () => {
  $api.box.typelist({}).then((res) => {
    state.box_type_list = res.data;
  });
};

const getItemsTypeList = () => {
  $api.items.typelist({}).then((res) => {
    let list = res.data;
    if (list && list.length != 0) {
      state.shop_type_list = res.data;
    }
  });
};

const addLoading = ref(false);
const addVisible = ref(true);
const rules = {};

const formRef = ref();
const loading = ref(false);
const form = reactive({});

const removeReward = (data, index) => {
  state[data].splice(index, 1);
};

const addReward = (data) => {
  console.log("data...", data);
  state[data].push([]);
};

const state = reactive({
  box_type_list: [{ value: "", name: "" }],
  shop_type_list: [{ value: "", name: "" }],
});

const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = (type) => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      addLoading.value = true;
      var _data = [];
      for (var i in state[type]) {
        _data.push(state[type][i]["value"], state[type][i]["name"]);
      }
      var payload = {
        type: type,
        data: _data.join(","),
      };
      $api.items
        .itemTypeAdd(payload)
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
        });
    }
  });
};
</script>
<style lang="scss" scoped></style>

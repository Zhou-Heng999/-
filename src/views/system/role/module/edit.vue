<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="编辑角色"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >

        <el-form-item label="角色名字" prop="nick">
          <el-input v-model="form.nick" placeholder="请输入角色名字" />
        </el-form-item>

        <el-form-item label="权限" prop="menu_ids" ref="menu_tree">
              <el-tree :data="props.menuData" accordion @check="menuSelect"
              show-checkbox node-key="id" :default-checked-keys="info.menu_ids"/>
        </el-form-item>

        <el-row class="btn-container">
          <el-button
            size="small"
            :loading="editLoading"
            type="primary"
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
  menuData: [],
});
const addVisible = ref(true);
const editLoading = ref(false);
const menu_tree = ref();
const rules = {
  nick: [{ required: true, message: "请输入角色名字", trigger: "blur" }],
};

const formRef = ref();
const loading = ref(false);
const form = reactive({
  id: "",
  nick: "",
  menu_ids: "",
});

watch(
  () => props.info,
  (val) => {
    let { id, name, menu_ids } = val;
    form.id = id;
    form.nick = name;
    form.menu_ids = menu_ids;

    console.log("editInfo", menu_tree);
    console.log("editInfo", val);
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
})

const menuSelect = (obj1, obj2) => {
    let _sel = []
    for (var i in obj2.checkedKeys) {
        if (typeof(obj2.checkedKeys[i]) != "undefined") {
            _sel.push(obj2.checkedKeys[i])
        }
    }
    _sel = _sel.join(",")
    console.log("sel_menuids...", _sel)
    form.menu_ids = _sel
}
const onSuccess = (val) => {};
const handleClickChoose = () => {};
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true;

      $api.roles
        .roleUpdate(form)
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
<style lang="scss" scoped></style>

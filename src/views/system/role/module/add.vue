<template>
  <el-dialog
    v-model="props.addVisible"
    width="632px"
    @close="emit('closeModal')"
    title="添加角色"
  >
    <div v-loading="loading" class="new">
      <el-form
        ref="formRef"
        :model="form"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="角色名字" prop="username">
          <el-input v-model="form.nick" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="权限" prop="menu_ids">
              <el-tree :data="props.menuData" accordion @check="menuSelect" show-checkbox node-key="id"/>

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
import {
  onMounted,
} from "vue";
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
  menuData: [],
});
const defaultProps = {
  children: 'children',
  label: 'label',
}
const addLoading = ref(false);
const addVisible = ref(true);

const formRef = ref();
const loading = ref(false);
const form = reactive({
  nick: "",
  menu_ids:"",
});
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
      addLoading.value = true;
      $api.roles
        .roleAdd(form)
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

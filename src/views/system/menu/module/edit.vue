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

        <el-form-item label="菜单名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="菜单组" prop="group_name">
          <el-input v-model="form.group_name" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="顺序编号" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入角色名称" />
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
    name: [{ required: true, message: "请输入角色名字", trigger: "blur" }],
    url: [{ required: true, message: "请输入角色名字", trigger: "blur" }],
    group_name: [{ required: true, message: "请输入角色名字", trigger: "blur" }],
    weight: [{ required: true, message: "请输入角色名字", trigger: "blur" }],
  };

  const formRef = ref();
  const loading = ref(false);
  const form = reactive({
    id: "",
    name: "",
    url: "",
    group_name: "",
    weight :"",
  });

  watch(
      () => props.info,
      (val) => {
        form.id = val.id;
        form.name = val.name;
        form.url = val.view_name;
        form.group_name = val.menu_group;
        form.weight = val.weight;
      },
      {
        immediate: true,
        deep: true,
      }
  );

  onMounted(() => {
  })

  const onSuccess = (val) => {};
  const handleClickChoose = () => {};
  const submitForm = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        editLoading.value = true;

        $api.roles
            .menuUpdate(form)
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

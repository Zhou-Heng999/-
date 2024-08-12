<template>
    <div>
        <el-popover
          placement="left-end"
          :width="props.width"
          trigger="hover"
        >
          <template #reference>
            <div class="flex-center">
              <div class="icon-style flex-center">
                <el-icon color="#ffffff" :size="20"><Star /></el-icon>
              </div>
            </div>
            <!-- <el-button>操作</el-button> -->
          </template>

          <template #default>
            <slot></slot>
          </template>

        </el-popover>
    </div>
</template>

<script setup>
import { ref, reactive } from "@vue/reactivity";
import { getCurrentInstance, watch } from "@vue/runtime-core";
import { Expand, Edit, Star } from "@element-plus/icons-vue";
const { $api } = getCurrentInstance().appContext.config.globalProperties;
const props = defineProps({
    info: {
        type: Object,
        default: {},
    },
    width: {
        type: Number,
        default: 400,
    }
});
const addVisible = ref(true);
const editLoading = ref(false);

const formRef = ref();
const loading = ref(false);
const form = reactive({
    groupId: "",
    msgseq: "",
    msgtype: "",
    msgcontent: "",
    // toAccount: "",
});

</script>
<style lang="scss" scoped>
.el-select {
    flex: 1;
}

.flex-center{
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-style{
  width: 30px;
  height: 30px;
  border-radius:50%;
  background: #409EFC;
  // border: 1px solid #409EFC;
}
</style>
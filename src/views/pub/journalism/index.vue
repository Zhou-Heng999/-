<template>
  <div class="table-container">
    <search-bar
      :form-config="formConfig"
      :valueForm="queryParam"
      @handleSearch="searchQuery"
      @handleReset="searchReset"
      class="bar"
    ></search-bar>
    <div class="button-group">
      <el-button type="primary" :icon="Plus" @click="isAddShow = true"
        >新建广告</el-button
      >
    </div>
    <el-table
      ref="filterTableRef"
      stripe
      class="table-list"
      row-key="date"
      :data="state.tableData"
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="title" label="标题" >
      </el-table-column>
      <!-- <el-table-column prop="article" label="文章" width="60"> </el-table-column> -->
      <!-- <el-table-column prop="image" label="图片"> </el-table-column> -->
      <el-table-column
        prop="image"
        label="图片"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <img
            :src="$setImageUrl(scope.row.image)"
            alt
            style="max-height: 100px"
            width="100"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-button
            size="small"
            :type="scope.row.status == 0 ? 'success' : 'warning'"
          >
            {{ scope.row.status == 0 ? "显示" : "隐藏" }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定要操作吗？"
            @confirm="handleUp(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button
                size="small"
                :type="scope.row.status == false ? 'warning' : 'success'"
              >
                {{ scope.row.status == false ? "隐藏" : "显示" }}
              </el-button>
            </template>
          </el-popconfirm> -->
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除该条记录吗？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="flex-end">
      <el-pagination
        v-model:currentPage="state.currentPage"
        v-model:page-size="state.pageSize"
        :page-sizes="[10, 50, 100, 200, 300, 500]"
        :small="small"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
  <add-modal
    :addVisible="isAddShow"
    @updateList="getAdList"
    @closeModal="isAddShow = false"
  />
  <edit-modal
    v-if="isEditShow"
    :addVisible="isEditShow"
    @updateList="getAdList"
    @closeModal="isEditShow = false"
    :info="editInfo"
  />
</template>
<script setup>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { Plus } from "@element-plus/icons-vue";
import addModal from "./module/add.vue";
import editModal from "./module/edit.vue";
import store from "@/store";
import searchBar from "@/components/SearchBar/index.vue";
import { ElMessage } from "element-plus";

const { $api } = getCurrentInstance().appContext.config.globalProperties;
const isAddShow = ref(false);
const isEditShow = ref(false);
const filterTableRef = ref();
const tableLoading = ref(true);
const state = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 50,
  editor:null
});


const formConfig = reactive({
  // 搜索栏配置项
  formItemList: [{ type: "input", placeholder: "输入广告名称", key: "name" }],
});
const queryParam = reactive({
  //搜索表单
  name: "",
});

const editInfo = ref();

// 初始化加载
onMounted(() => {
  let param = {
    size: state.pageSize,
    page: state.currentPage,
  };
  getAdList(param);
});

const initCKEditor = () => {
  CKEditor.create(document.querySelector("#editor"), {
    toolbar: [
      "undo", //撤销
      "redo", //重做
      "|",
      "heading",
      "|",
      "bold",
      "italic",
      "Underline",
      "fontSize",
      "numberedList",
      "bulletedList",
      "blockQuote",
      "|",
      "alignment:left",
      "alignment:right",
      "alignment:center",
      "alignment:justify",
      "|",
      "imageUpload",
      "Link",
      "|",
    ],
    heading: {
      options: [
        { model: "paragraph", title: "段落", class: "ck-heading_paragraph" },
        {
          model: "heading5",
          view: "h5",
          title: "标题5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading4",
          view: "h4",
          title: "标题4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading3",
          view: "h3",
          title: "标题3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading2",
          view: "h2",
          title: "标题2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading1",
          view: "h1",
          title: "标题1",
          class: "ck-heading_heading1",
        },
      ],
    },
    language: "zh-cn",
    fontSize: {
      options: ["default", 14, 16, 18, 20, 22, 24],
    },
    ckfinder: {
      uploadUrl: "/admin/Upload/uploadUrl",
      //后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
    },
  })
    .then((editor) => {
      const toolbarContainer = document.querySelector("#toolbar-container");
      toolbarContainer.appendChild(editor.ui.view.toolbar.element);
      state.editor = editor; //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
      console.log(editor, state.editor);
    })
    .catch((error) => {
      console.error(error);
    });
};
// methods
// 获取表格数据
const getAdList = (param) => {
  $api.news.newsList(param).then((res) => {
    state.tableData = res.data;
    console.log("getAdList", res);
    tableLoading.value = false;
    state.total = res.count;
  });
};

const searchQuery = (val) => {
  console.log("searchQuery", val);
  let param = {
    size: state.pageSize,
    page: state.currentPage,
    name: val.name,
  };
  getAdList(param);
};
const searchReset = () => {
  console.log("searchReset");
};

// 编辑
const handleEdit = (row) => {
    editInfo.value = row;
    isEditShow.value = true;
};
// 上线/下线
const handleUp = (index, row) => {
  let param = {
    id: row.id,
    status: row.status,
  };
  $api.news.upAd(param).then((res) => {
    console.log("Up/Down", res);
    ElMessage({
      type: "success",
      showClose: true,
      message: "修改成功",
    });
    getAdList({
      size: "100",
      page: "1",
    });
  });
};
// 删除
const handleDelete = (index, row) => {
  let param = {
    id: row.id,
  };
  $api.news.del(param).then((res) => {
    console.log("删除", res);
    ElMessage({
      type: "success",
      showClose: true,
      message: "删除成功",
    });
    getAdList({
      size: state.pageSize,
      page: state.currentPage,
    });
  });
};

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  state.pageSize = val;
  getAdList({
    size: state.pageSize,
    page: state.currentPage,
  });
};
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  state.currentPage = val;
  getAdList({
    size: state.pageSize,
    page: state.currentPage,
  });
};
</script>
<style lang="scss" scoped>
.button-group {
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
}

.table-container {
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

.sss {
  height: 500px;
}
//设置编辑器内容区域最小高度
#editor {
  min-height: 380px;
  min-width: 200px;
  max-height: 300px;
  max-width: 1000px;

  border: 1px solid #c4c4c4;
}
:deep.ck-content {
  min-height: 380px;
}
</style>

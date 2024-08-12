<template>
  <!-- 全量模式 -->
  <div v-if="props.tableType == 'full'" style="height: 100%">
    <el-card style="height: 100%">
      <template #header>
        <div class="flex-center-between top_cut">
          <div class="mt10 flex-align">
            <slot name="leftView" :data="pageState.tableAllData"> </slot>

            <span class="mt10">{{ !$isPhone ? $t(props.title) : "" }}</span>
          </div>

          <div
            :style="{
              width: props.isBottom || !props.title ? '100%' : '80%',
            }"
            v-if="props.formConfig"
          >
            <search-bar
              :form-config="props.formConfig"
              :valueForm="props.valueForm"
              :isBottom="props.isBottom"
              :column="props.column"
              :tableUrl="tableUrl"
              @handleSearch="searchQuery"
              @handleReset="searchReset"
              :isShowExcel="false"
            ></search-bar>
          </div>
          <div class="mt10" v-if="slots.rightView">
            <slot name="rightView" :data="pageState.tableAllData"> </slot>
          </div>
        </div>
      </template>
      <div class="flex-between mt10 mb10">
        <el-space :size="10">
          <span></span>
          <div v-if="props.btnList.length != 0">
            <el-button
              size="small"
              v-for="(item, index) in props.btnList"
              :key="index"
              :type="item.btnType ?? 'primary'"
              @click="emits('btnClick', item)"
              >{{ $t(item.title) }}</el-button
            >
          </div>
          <slot name="tableLeft" :data="pageState.tableAllData"> </slot>
        </el-space>
        <el-space :size="10">
          <slot name="tableRight" :data="pageState.tableAllData"> </slot>

          <el-tooltip
            :content="$t('851')"
            v-if="props.isCanCheck"
            placement="top"
          >
            <el-icon @click="setCurrent"><CircleClose /></el-icon>
          </el-tooltip>
          <el-tooltip :content="$t('852')" placement="top">
            <el-icon @click="updateTable"><RefreshRight /></el-icon>
          </el-tooltip>

          <!-- 表格设置 -->
          <el-tooltip :content="$t('853')" placement="top">
            <el-icon ref="buttonRef"><Setting /></el-icon>
          </el-tooltip>
          <!-- 导出表格 -->
          <el-tooltip :content="$t('200462')" placement="top">
            <el-icon
              @click="
                exportExcel(
                  props.tableHeader,
                  props.valueForm,
                  props.tableUrl,
                  props.tableList
                )
              "
              ><Document
            /></el-icon>
          </el-tooltip>
        </el-space>
      </div>
      <el-table
        ref="singleTableRef"
        :data="isFilter ? pageState.filterList : pageState.tableList"
        :fit="true"
        :height="props.height"
        class="mb10"
        style="width: 100%"
        v-loading="isTableLoading"
        :highlight-current-row="props.isCanCheck"
        @row-click="rowClick"
        @cell-dblclick="cellDblclick"
      >
        <el-table-column label="排序" width="55" v-if="props.sortable">
          <el-icon size="20" class="ql-icon"><Rank /></el-icon>
        </el-table-column>
        <el-table-column v-if="isCheckMore" type="selection" width="55" />
        <template v-for="(item, index) in pageState.headerList" :key="index">
          <el-table-column
            :prop="item.key"
            :label="$t(`${item.title}`)"
            :width="item.width"
            :fixed="item.fixedType ? item.fixedType : false"
            align="center"
          >
            <template #default="scope">
              <template v-if="item.isNeedSlot">
                <slot
                  :row="{
                    ...item,
                    tableInfo: pageState.tableAllData,
                    ...scope.row,
                    index,
                    $index: scope.$index,
                  }"
                >
                </slot>
              </template>
              <template v-else>
                <slot v-if="!item.typeList">
                  <div>
                    <template v-if="!timeRow(item.key, item.keyType)">
                      <template v-if="item.key != 'edit_row'">
                        <template v-if="item.key == 'account_remark'">
                          <el-link
                            @click.stop="$openAccountModal(scope.row)"
                            type="primary"
                          >
                            <div class="flex-column flex-center">
                              <span>{{ scope.row[item.key] }}</span>
                              <span>({{ scope.row.account_name }})</span>
                            </div>
                          </el-link>
                        </template>
                        <!-- <template v-else-if="item.isCanEdit">
                          <el-input
                            v-if="item.isCanEdit"
                            v-model="scope.row[item.key]"
                          ></el-input>
                          
                        </template> -->
                        <template v-else>
                          {{ scope.row[item.key] }}
                        </template>
                      </template>

                      <slot
                        v-else
                        :row="{
                          ...item,
                          ...scope.row,
                          index,
                          $index: scope.$index,
                        }"
                      >
                      </slot>
                    </template>

                    <template v-else>
                      {{ setTime(scope.row[item.key]) }}
                    </template>
                  </div>
                </slot>
                <slot v-if="item.typeList">
                  <template
                    v-if="getHasType(item.typeList, scope.row, item.key)"
                  >
                    <el-tag
                      :type="
                        getTypeOption(item.typeList, 'type')[
                          scope.row[item.key]
                        ].color ?? ''
                      "
                      v-if="
                        getTypeOption(item.typeList, 'type')[
                          scope.row[item.key]
                        ].name
                      "
                    >
                      {{
                        getTypeOption(item.typeList, "type")[
                          scope.row[item.key]
                        ].name
                      }}
                    </el-tag>
                  </template>
                  <template v-else>{{ scope.row[item.key] }}</template>
                </slot>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="flex-end" style="height: 40px" v-if="props.isPaginationShow">
        <el-pagination
          v-model:current-page="pageState.page"
          v-model:page-size="pageState.size"
          :page-sizes="[100, 200, 300, 400]"
          background
          layout="total, sizes, prev, pager, next"
          :total="pageState.count"
          @current-change="getTableList()"
          @size-change="getTableList()"
        />
      </div>
    </el-card>

    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRef"
      trigger="click"
      virtual-triggering
      :width="200"
    >
      <div class="flex-column">
        <div class="flex bottom-border">
          <el-checkbox
            v-model="checkAll"
            @change="handleCheckAllChange"
            :indeterminate="isIndeterminate"
            >{{ $t("854") }}</el-checkbox
          >
        </div>

        <div
          class="flex-between max-width"
          v-for="(item, index) in pageState.allHeaderList"
        >
          <el-space>
            <el-checkbox-group
              v-model="checkedItems"
              @change="handleCheckedItem"
            >
              <el-checkbox
                :key="item.key"
                :checked="item.isCheck"
                :label="item.key"
              >
                <div class="t-text">{{ $t(item.title) }}</div>
              </el-checkbox>
            </el-checkbox-group>
          </el-space>
          <el-space :size="10">
            <el-tooltip :content="$t('855')" placement="top">
              <el-icon
                @click="changeFixed(item, 'left', index)"
                :color="item.fixedType == 'left' ? '#409eff' : ''"
                ><Back
              /></el-icon>
            </el-tooltip>
            <el-tooltip :content="$t('856')" placement="top">
              <el-icon
                @click="changeFixed(item, 'right', index)"
                :color="item.fixedType == 'right' ? '#409eff' : ''"
                ><Right
              /></el-icon>
            </el-tooltip>
          </el-space>
        </div>
      </div>
    </el-popover>
  </div>
  <!-- 简单模式 -->
  <template v-else>
    <div>
      <div v-if="props.title" class="el-descriptions__title mb20">
        {{ $t(props.title) }}
      </div>
      <el-table
        ref="singleTableRef"
        :data="isFilter ? pageState.filterList : pageState.tableList"
        :fit="true"
        :height="props.height"
        class="mb10"
        style="width: 100%"
        v-loading="isTableLoading"
        :highlight-current-row="props.isCanCheck"
        @row-click="rowClick"
      >
        <el-table-column width="55">
          <el-icon><DCaret /></el-icon>
        </el-table-column>
        <el-table-column v-if="isCheckMore" type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in pageState.headerList"
          :key="index"
          :prop="item.key"
          :label="$t(`${item.title}`)"
          :width="item.width"
          :fixed="item.fixedType ? item.fixedType : false"
          align="center"
        >
          <template #default="scope">
            <template v-if="item.isNeedSlot">
              <slot
                :row="{
                  ...item,
                  tableInfo: pageState.tableAllData,
                  ...scope.row,
                  index,
                  $index: scope.$index,
                }"
              >
              </slot>
            </template>
            <template v-else>
              <slot v-if="!item.typeList">
                <div>
                  <template v-if="!timeRow(item.key, item.keyType)">
                    <template v-if="item.key != 'edit_row'">
                      {{ scope.row[item.key] }}
                    </template>
                    <template v-else>
                      <slot
                        :row="{
                          ...item,
                          ...scope.row,
                          index,
                          $index: scope.$index,
                        }"
                      ></slot>
                    </template>
                  </template>
                  <template v-else>
                    {{ setTime(scope.row[item.key]) }}
                  </template>
                </div>
              </slot>
              <slot v-if="item.typeList">
                <template v-if="getHasType(item.typeList, scope.row, item.key)">
                  <el-tag
                    :type="
                      getTypeOption(item.typeList, 'type')[scope.row[item.key]]
                        .color ?? ''
                    "
                    v-if="
                      getTypeOption(item.typeList, 'type')[scope.row[item.key]]
                        .name
                    "
                  >
                    {{
                      getTypeOption(item.typeList, "type")[scope.row[item.key]]
                        .name
                    }}
                  </el-tag>
                </template>
                <template v-else>{{ scope.row[item.key] }}</template>
              </slot>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  reactive,
  getCurrentInstance,
  computed,
  useAttrs,
  useSlots,
} from "vue";
import { useRouter } from "vue-router";
import { ClickOutside as vClickOutside } from "element-plus";
import {
  RefreshRight,
  Setting,
  Document,
  Back,
  Right,
  CircleClose,
  Rank,
} from "@element-plus/icons-vue";
import mixin from "@/mixins/list.js";
import store from "@/store";
import dayjs from "dayjs";
import router from "@/router/index.js";
import FileSaver from "file-saver";
import * as XLSX from "xlsx"; //这是vue3导入XLSX的方法
import XLSXS from "xlsx-js-style";
import i18n from "@/locales/index";
const slots = useSlots();
const t = i18n.global.t;

const { exportExcel, getTypeOption } = mixin();
const constType = computed(() => store.state.app.typeList);
const { $api, $isPhone } =
  getCurrentInstance().appContext.config.globalProperties;
const { proxy, ctx } = getCurrentInstance();
const attrs = useAttrs();
const emits = defineEmits(
  "btnClick",
  "chooseRow",
  "cancelRow",
  "searchQuery",
  "upTable",
  "searchReset"
);
const props = defineProps({
  tableType: {
    type: String,
    default: "full",
  },
  tableHeader: {
    type: Array,
    default: [],
  },
  isBottom: {
    type: Boolean,
    default: false,
  },
  tableList: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
  btnList: {
    type: Array,
    default: [],
  },
  tableUrl: {
    type: String,
    default: "",
  },
  allTableInfo: {
    type: Object || null,
    default: null,
  },
  formConfig: {
    type: Object || null,
    default: null,
  },
  height: {
    type: Number || String,
    default: '65vh',
  },
  valueForm: {
    type: Object,
    default: () => {},
  },
  isCanCheck: {
    type: Boolean,
    default: false,
  },
  sortable: {
    type: Boolean,
    default: false,
  },
  isPaginationShow: {
    type: Boolean,
    default: true,
  },
  isCheckMore: {
    type: Boolean,
    default: false,
  },
});
const pageState = reactive({
  headerList: [],
  allHeaderList: [],
  tableList: [],
  page: 1,
  size: 100,
  count: null,
  tableAllData: null,
  filterList: [],
});

const headerList = ref([]);
const checkedItems = ref([]);
const checkAll = ref(true);
const allList = ref([]);
const tableId = ref(null);
const setTableID = () => {
  let tableIdList = JSON.parse(localStorage.getItem("tableIdList"));

  let { tableHeader } = props;
  let nameList = tableHeader.map((item) => {
    if (item.key != "edit_row") {
      let [a] = [...item.key];
      return a;
    }
  });
  tableId.value = `${router.currentRoute._value.path}_${nameList.join("")}`;
};
const setListColumn = () => {
  let tableIdList = JSON.parse(localStorage.getItem("tableIdList")) || {};
  if (tableIdList[tableId.value]) {
    pageState.allHeaderList.forEach((item) => {
      item.isCheck = tableIdList[tableId.value].includes(item.key);
    });
    pageState.headerList = pageState.allHeaderList.filter((item) =>
      tableIdList[tableId.value].includes(item.key)
    );
  }
};

const tableData = () => {
  return pageState.tableList
}

watch(checkedItems, (val) => {
  let tableIdList = JSON.parse(localStorage.getItem("tableIdList")) || {};

  if (val.length == props.tableHeader.length) {
    delete tableIdList[tableId.value];
  } else {
    tableIdList[tableId.value] = val;
  }
  localStorage.setItem("tableIdList", JSON.stringify(tableIdList));
});
onMounted(() => {
  setTableID();
  let list = props.tableHeader.filter((item) => item.key != "account_name");
  let listLen = props.tableHeader.length - 1;
  list.forEach((item, index) => {
    allList.value.push(item.prop);
    pageState.allHeaderList.push({
      ...item,
      fixedType: item.fixedType
        ? item.fixedType
        : index == 0
        ? "left"
        : index == listLen && item.fixedType == ""
        ? "right"
        : item.key == "edit_row"
        ? "right"
        : "",
      isShowColumn: item.isShowColumn && item.isShowColumn ? false : true,
      isCheck: true,
    });
  });
  pageState.headerList = pageState.allHeaderList;
  setListColumn();
  checkAll.value = true;
  getTableList();
});

const getHasType = (typeList, row, key) => {
  return getTypeOption(typeList, "type")[row[key]] ?? "";
};
const cellDblclick = (row, column) => {
  let { rawColumnKey, rowSpan, property } = column;
  console.log(rawColumnKey, rowSpan, property);
};
const cities = [t("854"), t("857")];
const buttonRef = ref();
const popoverRef = ref();
const isTableLoading = ref(false);
const isIndeterminate = ref(false);
// 刷新表格数据
const updateTable = () => {
  if (props.tableUrl) {
    isTableLoading.value = true;
    pageState.tableList.length = 0;
    pageState.page = 1;
    getTableList();
  } else {
    isTableLoading.value = true;
    setTimeout(() => {
      isTableLoading.value = false;
    }, 1200);
    if (attrs.onSearchQuery) {
      emits("searchQuery", props.valueForm);
      isTableLoading.value = true;
      setTimeout(() => {
        isTableLoading.value = false;
      }, 1200);
    } else {
      emits("upTable");
    }
  }
};
// 搜索
const searchQuery = () => {
  let { tableUrl } = props;
  if (tableUrl) {
    getTableList();
  } else {
    if (attrs.onSearchQuery) {
      emits("searchQuery", props.valueForm);
      isTableLoading.value = true;
      setTimeout(() => {
        isTableLoading.value = false;
      }, 1200);
    } else {
      filterTableList();
    }
  }
};
const timeRow = (key, keyType) => {
  let reg = /_time$/;
  return reg.test(key) || keyType == "time";
};
const setTime = (time, ty = "YYYY-MM-DD HH:mm:ss") => {
  if (time == 0) {
    return "";
  }
  if (typeof time == "string") return time;
  //13位数字转为10位
  if(time.toString().length>10){
    let ten_time = (time.toString()).slice(0,10)
    let timestamp = Number(ten_time)
    return dayjs.unix(timestamp).format(ty)
  }
  return dayjs.unix(time).format(ty);
};
// 重置
const searchReset = () => {
  isFilter.value = false;
  emits("searchReset");
};
const isFilter = ref(false);
// 传入tableList后条件筛选
const filterTableList = () => {
  let k = pageState.tableList.filter((item) => {
    for (let i in props.valueForm) {
      if (props.valueForm[i] == "") {
        continue;
      } else if (props.valueForm[i] != item[i]) {
        return false;
      }
    }
    return true;
  });
  isFilter.value = true;
  pageState.filterList = k;
};

// 选中某一项
const rowClick = (val) => {
  emits("chooseRow", val);
};
// const handleCurrentChange = (val) => {
//   emits("chooseRow", val);
// };
// 取消选择
const singleTableRef = ref();
const setCurrent = (row) => {
  singleTableRef.value.setCurrentRow(row);
  emits("cancelRow");
};

// 获取选中的数据
const getCheckMoreList = (val) => {
  let list = singleTableRef.value.getSelectionRows();
  return list;
};
watch(
  () => props.tableList,
  (val) => {
    pageState.tableList = props.tableList;
    pageState.count = props.tableList.length;
  }
);
const getTableList = async (tableUrl = props.tableUrl) => {
  let { size, page } = pageState;
  let newData = { ...props.valueForm, size, page };
  // 统一去除props.formConfig 错误时间参数
  if (props.formConfig) {
    let flist = props.formConfig.formItemList.filter(
      (item) => item.type == "datetimerange"
    );
    if (flist.length != 0) {
      flist.forEach((item) => {
        item.key.forEach((p, pindex) => {
          if (newData[item.key]) {
            newData[p] = newData[item.key][pindex] / 1000;
            if (pindex == item.key.length - 1) {
              delete newData[item.key];
            }
          }
        });
      });
    }
    if ($isPhone) {
      props.formConfig.formItemList = [props.formConfig.formItemList[0]];
    }
  }

  pageState.tableList = [];
  if (props.tableList.length != 0) {
    pageState.tableList = props.tableList;
    pageState.count = props.tableList.length;
  }
  if (props.allTableInfo) {
    pageState.tableAllData = props.allTableInfo;
  }
  if (!tableUrl) return;
  let httpArr = tableUrl.split(".");
  isTableLoading.value = true;
  try {
    let tableObj = await $api[httpArr[0]][httpArr[1]](newData);
    console.log(tableObj)
    let { count, data } = tableObj;
    pageState.tableAllData = data;
    pageState.count = tableObj.data.total ?? data.list.length;
    pageState.tableList = data.list;

    setTimeout(() => {
      isTableLoading.value = false;
    }, 500);
  } catch {
    isTableLoading.value = false;
  }
};

const isPeopleShow = ref(false);
const editPageInfo = ref(null);
const getAccountInfo = (row) => {
  console.log("getAccountInfo", row);
  // return;
  let account_id = row.uid;
  $api.account
    .getAccountList({
      page: 1,
      size: 1,
      account_id,
    })
    .then((res) => {
      isPeopleShow.value = true;
      editPageInfo.value = res.data[0];
      console.log("isPeopleShow", editPageInfo.value);
    });
};

const filterItem = (_key, _value) => {
  let index = pageState.tableList.findIndex((item) => item[_key] == _value);
  if (index < 0) {
    return;
  }

  let item = pageState.tableList[index];

  pageState.tableList.splice(index, 1);

  pageState.tableList.unshift(item);

  singleTableRef.value.setCurrentRow(item);

  emits("chooseRow", item);
};

defineExpose({
  updateTable,
  getTableList,
  getCheckMoreList,
  filterItem,
  tableData
});

// 是否全选
const handleCheckAllChange = (val) => {
  checkedItems.value = val ? allList.value : [];
  isIndeterminate.value = false;
};

// 是否固定列
const changeFixed = (item, type, index) => {
  pageState.allHeaderList[index].fixedType = item.fixedType == type ? "" : type;
};
const handleCheckedItem = (val) => {
  const len = checkedItems.value.length;
  checkAll.value = len != 0;
  pageState.headerList = pageState.allHeaderList.filter((item) =>
    val.includes(item.key)
  );
  isIndeterminate.value = len > 0 && len < props.tableHeader.length;
};
</script>
<style lang="scss" scoped>
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.h30 {
  height: 30px;
}
.w-300 {
  width: 300px;
}
.top_cut {
  margin-top: -10px;
  min-height: 36px;
  width: 100%;
}
:depp(.el-checkbox-group) {
  font-size: 12px;
}
.bottom-border {
  border-bottom: 1px solid #efefef;
}
.el-table .cell,
.el-table th > .cell {
  display: inline-block;
  white-space: nowrap;
  width: auto;
  overflow: auto;
}
.t-text {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

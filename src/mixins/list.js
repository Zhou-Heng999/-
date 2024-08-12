import {
  ref,
  computed,
  watch,
  reactive,
  onMounted,
  getCurrentInstance,
  h,
  nextTick,
} from "vue";
import store from "@/store";
import $api from "@/api/index.js";
import {
  ElMessage,
  ElMessageBox,
  ElInput,
  ElSelect,
  ElOption,
  ElImage,
  ElButton,
} from "element-plus";
import $dayjs from "dayjs";
import router from "@/router/index.js";
import table2excel from "js-table2excel";

import FileSaver from "file-saver";
import * as XLSX from "xlsx"; //这是vue3导入XLSX的方法
import XLSXS from "xlsx-js-style";
import i18n from "@/locales/index";
import axios from 'axios';

const t = i18n.global.t;
// import * as constType from "@/const";
const { state, commit, dispatch } = store;

export default function () {
  const pageState = reactive({
    initTabList: [],
    tabListData: [],
    sliceTable: [],
    totalNum: 0,
    currentPage: 1,
    pageSize: 20,
  });

  const constType = store?.state.app.typeList;
  const excelList = ref([]);
  const startTime = new Date(
    new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000
  );
  const endTime = new Date(
    new Date(new Date().toLocaleDateString()).getTime() +
      24 * 60 * 60 * 1000 -
      1
  );

  const setTimestamp = (time, ty = "YYYY-MM-DD HH:mm:ss") => {
    if (!time || time == 0) {
      return "";
    }
    if (typeof time == "string") return time;
    //13位数字转为10位
    if(time.toString().length>10){
      let ten_time = (time.toString()).slice(0,10)
      let timestamp = Number(ten_time)
      return $dayjs.unix(timestamp).format(ty)
    }
    return $dayjs.unix(time).format(ty);
  };
  
  const getMenuList = async () => {
    try {
      const list = await $api.login.menu();
      return new Promise((resolve, reject) => {
        if (list.data.menus_list && list.data.menus_list.length != 0) {
          let { menus_list, buttons_list } = list.data;
          // menus_list = [{}, ...menus_list];

          // commit("app/changeButton", buttons_list);
          // 菜单排序
          let menus = menus_list.sort((a,b)=>{
            return a.children[0].id - b.children[0].id
          })
          commit("app/changeMenu", menus);
          console.log("menus_list", menus);
          resolve(menus);
        } else {
          ElMessage({
            message: "暂无分配权限，请联系管理员",
            type: "warning",
          });
          reject();
        }
      });
  } catch (error) {
    ElMessage({
      message: "暂无分配权限，请联系管理员",
      type: "warning",
    });
  }
  };
  const handleCurrentChange = (val) => {
    pageState.currentPage = val;
  };
  watch(
    () => pageState.currentPage,
    (val) => {
      pageState.tabListData = pageState.sliceTable[val - 1];
    }
  );
  const linkList = [];
  const urlLink = (type, d) => {
    let { url } = linkList.find((item) => item.type == type);
    url = url + d;
    window.open(url);
  };

  const upTableList = (tableRef) => {
    tableRef.updateTable();
  };
  const resetForm = (formRef) => {
    formRef.resetFields();
  };

  // 客户信息展示
  const isPeopleShow = ref(false);
  const peopleInfo = ref(null);
  const openAccountModal = (item) => {
    if (!item) {
      commit("app/setPeoPle", item);
      return;
    }
    let account_id = item.uid;
    $api.account
      .getAccountList({
        page: 1,
        size: 1,
        account_id,
      })
      .then((res) => {
        console.log("row1", res.data[0]);
        commit("app/setPeoPle", res.data[0]);
      });
  };

  // 获取客户列表
  const getAccountOptions = () => {
    $api.account.getOptions().then((res) => {
      let list = res.data;

      // list = list.splice(0, 100);
      store.commit("app/changePeopleList", { type: "userOptions", list });
    });
  };

  // 获取币种列表
  const getWorkingOptions = () => {
    $api.hall.workingOptions().then((res) => {
      let list = res.data;
      store.commit("app/changePeopleList", { type: "cidList", list });
    });
  };

  // 获取充值币种列表
  const getRechargeOptions = () => {
    $api.hall.rechargeOptions().then((res) => {
      let list = res.data;
      store.commit("app/changePeopleList", { type: "rechargeOptions", list });
    });
  };

  //获取场面列表
  const getChangMianOptions = () => {
    $api.users.getOptions({ ty_id: "4" }).then((res) => {
      let list = res.data;
      store.commit("app/changePeopleList", { type: "CMOptions", list });
    });
  };
  // 获取桌子
  const getDesks = () => {
    $api.sys.options().then((res) => {
      let list = res.data;
      store.commit("app/changePeopleList", { type: "deskOptions", list });
    });
  };

  // 取消只读
  const cancalReadOnly = (onOff) => {
    nextTick(() => {
      setTimeout(() => {
        const { select } = this.$refs;
        const input = select.$el.querySelector(".el-input__inner");
        input.removeAttribute("readonly");
      }, 200);
    });
  };

  const passModal = async (num = "1") => {
    let onePass = ref("");
    let twoPass = ref("");
    let selectItem = ref("");
    let sign_user_id = ref("");
    let style = num == 1 ? "display:none" : "";
    let selectStyle = "display:none";
    return new Promise(async (resolve, reject) => {
      let peopleList = [];
      if (num == "2") {
        let data = await $api.login.sign_list();
        let userInfo = localStorage.getItem("userInfo");
        let list = data.data;
        userInfo = JSON.parse(userInfo);
        peopleList = list.filter((item) => item.user_id != userInfo.user_id);
        if (userInfo) {
          if (peopleList.length == 1) {
            selectItem.value = peopleList[0].user_name;
            sign_user_id.value = peopleList[0].user_id;
            selectStyle = "display:none";
          } else {
            selectStyle = "";
          }
        }
      }

      ElMessageBox({
        title: "操作密码",
        message: () =>
          h("div", null, [
            h("div", { style: "margin-bottom:10px" }, [
              h(ElInput, {
                type: "password",
                placeholder: "请输入操作密码",
                modelValue: onePass.value,
                onInput: (val) => {
                  onePass.value = val;
                },
              }),
            ]),
            h(
              ElSelect,
              {
                style: `${selectStyle};margin-bottom:10px;width:100%`,
                modelValue: selectItem.value,
                placeholder: "请选择二次确认密码操作员",
                onChange: (val) => {
                  sign_user_id.value = val;
                  let obj = peopleList.find((item) => item.user_id == val);
                  selectItem.value = obj.user_name;
                },
              },
              peopleList.map((item) => {
                return h(ElOption, {
                  label: item.user_name,
                  value: item.user_id,
                });
              })
            ),
            h(ElInput, {
              style,
              type: "password",
              placeholder: "请输入第二次操作密码",
              modelValue: twoPass.value,
              onInput: (val) => {
                twoPass.value = val;
              },
            }),
          ]),
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputType: "password",
        draggable: true,
      }).then((res) => {
        resolve({
          sign_opt_passwd: onePass.value,
          sign_user_passwd: twoPass.value,
          sign_user_name: selectItem.value,
          sign_user_id: sign_user_id.value,
        });
      });
    });
  };

  const codeModal = async (title) => {
    let code = ref("");
    let imageUrl = ref("");
    let uuid = ref("");
    return new Promise((resolve, reject) => {
      $api.account.getImageCaptcha().then((res) => {
        imageUrl.value = "data:image/png;base64," + res.img;
        uuid.value = res.uuid;

        ElMessageBox({
          title,
          style: "width:20vw",
          message: () =>
            h("div", { class: "flex" }, [
              h("div", { style: "margin-right:10px" }, [
                h(ElInput, {
                  placeholder: "请输入验证码",
                  modelValue: code.value,
                  onInput: (val) => {
                    code.value = val;
                  },
                }),
              ]),
              h(ElImage, {
                style: "height:30px",
                src: imageUrl.value,
                onClick: (val) => {
                  $api.account.getImageCaptcha().then((aes) => {
                    imageUrl.value = "data:image/png;base64," + aes.img;
                    uuid.value = aes.uuid;
                  });
                },
              }),
            ]),
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          inputType: "password",
          draggable: true,
        }).then((res) => {
          resolve({
            uuid: uuid.value,
            code: code.value,
          });
        });
      });
    });
  };

  const updateTable = (proxy, refs) => {
    proxy.$refs[refs].updateTable();
  };
  // 字典数据
  const getTypeOption = (name, type = "opt") => {
    let typeList = state.app.typeList;
    let info = typeList[name];
    if (!info) return "";
    let arr = [];
    if (type == "opt") {
      for (let i in info) {
        let { name: label, key: value, status, ...params } = info[i];
        arr.push({ label, value, disabled: status == "0", ...params });
      }
    }
    return type == "opt" ? arr : info;
  };
  const getOptUrlList = (url) => {
    let httpArr = url.split(".");
    $api[httpArr[0]][httpArr[1]]().then((res) => {
      return res.data;
    });
  };
  const getShortText = (data, direction = "center", l = 4, r = 4) => {
    if (!data || data.length <= 9) return data;
    if (typeof data != "string") return data;
    let text = "";
    if (direction == "center") {
      text = `${data.substring(0, l)}...${data.substring(
        data.length - r,
        data.length
      )}`;
    } else if (direction == "left") {
      text = `.....${data.substring(data.length - 10, data.length)}`;
    }
    return text;
  };
  const setTabList = () => {
    if (pageState.initTabList.length == 0) {
      pageState.tabListData.length = 0;
      return;
    }
    pageState.sliceTable = arraySlice(
      pageState.initTabList,
      pageState.pageSize
    );
    pageState.tabListData = pageState.sliceTable[pageState.currentPage - 1];
  };
  const arraySlice = (array, sliceNum) => {
    var newArray = [];
    let viod = 0; //数组初始量
    for (let i = 0; i < array.length; i++) {
      if (i % sliceNum == 0 && i != 0) {
        newArray.push(array.slice(viod, i));
        viod = i;
      }
      if (i + 1 == array.length) {
        newArray.push(array.slice(viod, i + 1));
      }
    }
    return newArray;
  };

  // 表格导出
  const excelState = reactive({
    page: 1,
    size: 10,
    list: [],
  });
  const exportExcel = async (
    column,
    valueForm,
    tableUrl,
    tableList = [],
    excelName = t(`menus.${router.currentRoute._rawValue.name}`)
  ) => {
    let count = 0;
    let data = [];

    if (tableUrl) {
      let httpArr = tableUrl.split(".");
      valueForm.size = excelState.size;
      valueForm.page = excelState.page;
      let tableObj = await $api[httpArr[0]][httpArr[1]](valueForm);
      count = tableObj.data.total;
      data = tableObj.data.list;
    } else {
      count = tableList.length;
      data = tableList;
    }
    excelState.list = [...excelState.list, ...data];

    column = column.filter((item) => item.key != "edit_row");
    // commit("setting/setExcelLoading", true);
    if (count && excelState.list.length < count) {
      excelState.page += 1;
      exportExcel(column, valueForm, tableUrl, tableList, excelName);
      return false;
    }

    if (column.length == 0 || excelState.list.length == 0) {
      // commit("setting/setExcelLoading", false);
      ElMessage({
        message: `数据不能为空`,
        type: "warning",
      });
      return;
    }

    let tableData = excelState.list;
    var now = $dayjs().format("YYYYMMDDHHmmss");
    column.forEach((item) => {
      item.title = t(item.title);
      if (!item.type) item.type = "text";
    });

    let typeArr = column.filter((item) => item.typeList);
    try {
      if (typeArr.length != 0) {
        tableData.forEach((item) => {
          typeArr.forEach((p) => {
            item[p.key] = t(`${constType[p.typeList][item[p.key]]?.name}`);
          });
        });
      }

      // 处理时间戳
      let reg = /_time$/;
      let isHasTime = column.some((item) => reg.test(item.key));
      if (isHasTime) {
        tableData.forEach((item) => {
          for (let i in item) {
            if (reg.test(i) && typeof item[i] == "number") {
              item[i] = $dayjs.unix(item[i]).format("YYYY-MM-DD HH:mm:ss");
              // 1970-01-01不显示
              if (new Date(item[i]).getTime() <= 0) {
                item[i] = "";
              }
            }
          }
        });
      }
      setTimeout(() => {
        // commit("setting/setExcelLoading", false);
      }, 1500);

      // return table2excel(column, tableData, (excelName ? excelName : "text") + now);

      // -------------

      let en = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      let pre = "A";

      // 创建空工作簿
      let workbook = XLSX.utils.book_new();

      // 将一组 JS 对象转换为工作表
      let colHead = {};
      column.forEach((item, i) => {
        colHead = Object.assign(colHead, { [en[i]]: item.title });
      });
      let ws = XLSX.utils.json_to_sheet([colHead], {
        skipHeader: true, //如果为 true，则不在输出中包含标题行
      });

      let result = [];
      for (let i = 0; i < tableData.length; i++) {
        let tableItem = tableData[i];
        let obj = {};
        for (let k = 0; k < column.length; k++) {
          let columnItem = column[k];
          pre = en[k];
          obj = Object.assign(obj, { [pre]: tableItem[columnItem.key] });
        }
        result.push(obj);
      }

      // 插入数据
      XLSX.utils.sheet_add_json(ws, result, { skipHeader: true, origin: "A2" });

      //将工作表附加到工作薄
      XLSX.utils.book_append_sheet(workbook, ws, excelName);

      // 修改样式
      const allow = [];
      const typeColor = {
        primary: "79bbff",
        success: "67c23a",
        info: "909399",
        warning: "e6a23c",
        danger: "F56C6D",
      };

      // 过滤出需要加样式的字段
      const Dict = [];
      // 字典
      for (const k in constType) {
        for (let i = 0; i < typeArr.length; i++) {
          if (k == typeArr[i].typeList) {
            for (const j in constType[k]) {
              Dict.push({ ...constType[k][j] });
            }
            break;
          }
        }
      }
      const NumberField = [
        "win",
        "coin",
        "num",
        "commission",
        "freeze",
        "cash",
        "finally",
        "winc",
        "balance",
        "to_amount",
        "consume",
        "p_win",
        "c_win",
        "updown",
      ];

      tableData.forEach((tableItem) => {
        for (const key in tableItem) {
          if (NumberField.includes(key)) {
            let t = tableItem[key] >= 0 ? "success" : "danger";
            Dict.push({ name: tableItem[key], color: t });
          }
        }
      });

      Dict.forEach((item) => {
        const c = item.color ? item.color : "primary";
        allow.push({ name: item.name, color: typeColor[c] });
      });

      // 循环找到对应的单元格修改样式
      for (const key in workbook.Sheets) {
        for (const k in workbook.Sheets[excelName]) {
          // 非!开头的属性都是单元格
          if (!k.startsWith("!")) {
            const td = workbook.Sheets[key][k];
            td.s = {
              font: {
                sz: 12,
              },
            };
            for (let i = 0; i < allow.length; i++) {
              const item = allow[i];
              if (item.name == td.v) {
                td.s = {
                  font: {
                    color: { rgb: item.color },
                  },
                };
              }
            }
          }
        }
      }

      const wbout = XLSXS.write(workbook, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      FileSaver.saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `${excelName + now}.xlsx`
      );
      excelState.list = [];
      excelState.page = 1;
    } catch (error) {
      ElMessage({
        message: `${error}`,
        type: "warning",
      });
    }
    // ------------------
  };

  const getSelectOpt = (type) => {
    let opt = [];
    Object.keys(constType[type]).forEach((key, value) => {
      let { lan: label, ...params } = constType[type][key];
      opt.push({ ...params, label, value: key });
    });
    return opt;
  };
  const filterType = (arr, type) => {
    let obj = arr.find((item) => item.label == type);
    return obj.name;
  };

  const uploadFiles = async (file) => {
      try {
          // console.log(file,state.fileList);
          if (!file) return;
          var fileName = file.name;
          var lastIndex = fileName.lastIndexOf('.');
          var extName = lastIndex > -1 ? fileName.slice(lastIndex + 1) : '';
          const uploadFilePromise = new Promise((resolve, reject) => {
              getUploadInfo(extName, (err, info) => {
                  console.log(info)
                  if (err) {
                      reject(err);
                      return;
                  }
                  info.file = file;
                  uploadFile(info, (err, fileUrl) => {
                      if (err) {
                          reject(err);
                          return;
                      }
                      resolve(fileUrl);
                  });
              });
          });
          let imgUrl = await uploadFilePromise;
          // console.log(imgUrl)
          return imgUrl;
      } catch (error) {
          console.error('uploadImage error', error);
          throw error;
      }
  }

  const uploadFile = (opt, callback) => {
      // 如果服务端用了临时密钥计算，需要传 x-cos-security-token
      if (opt.securityToken) formData['x-cos-security-token'] = opt.securityToken;
      const formData = new FormData();
      formData.append('key', opt.cosKey);
      formData.append('policy', opt.policy);
      formData.append('success_action_status', '200');
      formData.append('q-sign-algorithm', opt.qSignAlgorithm);
      formData.append('q-ak', opt.qAk);
      formData.append('q-key-time', opt.qKeyTime);
      formData.append('q-signature', opt.qSignature);
      formData.append('file', opt.file);
      console.log(formData)
      let config = {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }
      let url = opt.cosHost;
      axios.post(url, formData,config).then(res => {
          console.log(res)
          if (![200, 204].includes(res.status)) return callback && callback(res);
          var fileUrl = opt.cosHost + '/' + camSafeUrlEncode(opt.cosKey).replace(/%2F/g, '/');
          // console.log(fileUrl)
          callback && callback(null, fileUrl);
      }).catch(err => {
          // console.log("1111",err)
          if(!err){
              var fileUrl = opt.cosHost + '/' + camSafeUrlEncode(opt.cosKey).replace(/%2F/g, '/');
              callback && callback(null, fileUrl);
          }else {
              callback && callback(err);
          }
      });
  }

  const camSafeUrlEncode = (str) => {
      return encodeURIComponent(str)
          .replace(/!/g, '%21')
          .replace(/'/g, '%27')
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
          .replace(/\*/g, '%2A');
  }

  const getUploadInfo = (extName, callback) => {
      $api.appUser.postPolicy({
          ext: extName
      }).then((res) => {
          callback && callback(null, res.data);
      }).catch((err) => {
          callback && callback(err);
      })
  }

  const removeTip = (text) => {
      let regex = /_{(.*?)}/g;
      text = text.replace(regex, '');
      return text
  }

  const isJSON = (str) =>  {
    try {
      JSON.parse(str);
    } catch (e) {
      // 转换出错，抛出异常
      return false;
    }
    return true;
  }

  return {
    isJSON,
    removeTip,
    setTimestamp,
    handleCurrentChange,
    pageState,
    setTabList,
    getShortText,
    filterType,
    upTableList,
    urlLink,
    startTime,
    endTime,
    getMenuList,
    exportExcel,
    getSelectOpt,
    getTypeOption,
    updateTable,
    getOptUrlList,
    passModal,
    codeModal,
    resetForm,
    getAccountOptions,
    getWorkingOptions,
    getChangMianOptions,
    getRechargeOptions,
    getDesks,
    openAccountModal,
    uploadFiles
  };
}

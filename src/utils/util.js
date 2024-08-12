import { ElMessage } from "element-plus";
import { stringify } from "qs";
import RouteView from "@/components/routerView/index.vue";

// import BigNumber from 'bignumber.js'

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent("HTMLEvents");
  event.initEvent("resize", true, true);
  event.eventType = "message";
  window.dispatchEvent(event);
}

export function isMobile_pc() {
  let isMobile = false;
  let ua = navigator.userAgent.toLocaleLowerCase();
  let reg = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  isMobile =
    reg.test(ua) || window.location.href.indexOf("group-chat") != -1
      ? true
      : false;
  if (window.location.href.indexOf("group-chat") != -1) isMobile = true;
  return isMobile;
}

const modules = import.meta.glob("/src/views/*/*/*.vue");

const captureName = (str) => {
  str = str.substring(0, 1).toUpperCase() + str.substring(1);
  return str;
};
export function menuData(list, children = []) {
  list.forEach((item) => {
    if (item.children) {
      if (!item.url) {
        let urlArr = item.children[0].url.split("/");
        item.path = `/${urlArr[1]}`;
        item.meta = {
          title: item.title,
        };
        item.name = urlArr[1];
        item.component = RouteView;
      }
      menuData(item.children, []);
    } else {
      let urlArr = item.url.split("/");
      item.meta = {
        title: item.title,
      };
      item.path = item.url;
      item.name = urlArr[1] + captureName(urlArr[2]);
      item.component = modules[`/src/views${item.path}/index.vue`];
    }
    children.push(item);
  });
  return children;
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == "object")) {
    return;
  }

  for (let key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] === "")
    ) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  let regPos = /^\d+(\.\d+)?$/;
  if (regPos.test(value)) {
    //如果是数字
    let getDate = new Date(value);
    let o = {
      "M+": getDate.getMonth() + 1,
      "d+": getDate.getDate(),
      "h+": getDate.getHours(),
      "m+": getDate.getMinutes(),
      "s+": getDate.getSeconds(),
      "q+": Math.floor((getDate.getMonth() + 3) / 3),
      S: getDate.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (getDate.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  } else {
    //TODO
    value = value.trim();
    return value.substr(0, fmt.length);
  }
}
export function setImageUrl(url) {
  if (url.indexOf("https") != -1) return url;
  return import.meta.env.VITE_IMAGE_URL + url;
}
/**
 * 时间戳转换日期
 * @param timestamp 时间戳
 * @return 日期
 */
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M = changeDateNumber(date.getMonth() + 1) + "-";
  var D = changeDateNumber(date.getDate()) + " ";
  var h = changeDateNumber(date.getHours()) + ":";
  var m = changeDateNumber(date.getMinutes()) + ":";
  var s = changeDateNumber(date.getSeconds());
  return Y + M + D + h + m + s;
}
function changeDateNumber(num) {
  num = parseInt(num);
  return num < 10 ? `0${num}` : num;
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  if (arguments.length === 1) {
    let [length] = arguments;
    // 生成指定长度的随机数字，首位一定不是 0
    let nums = [...Array(length).keys()].map((i) =>
      i > 0 ? random(0, 9) : random(1, 9)
    );
    return parseInt(nums.join(""));
  } else if (arguments.length >= 2) {
    let [min, max] = arguments;
    return random(min, max);
  } else {
    return Number.NaN;
  }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1;
  if (!chats) chats = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  let str = "";
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1);
    str += chats[num];
  }
  return str;
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  let chats = "0123456789abcdef";
  return randomString(32, chats);
}

/**
 * 下划线转驼峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string) {
  return string.replace(/_([a-z])/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 判断是否显示办理按钮
 * @param bpmStatus
 * @returns {*}
 */
export function showDealBtn(bpmStatus) {
  if (bpmStatus != "1" && bpmStatus != "3" && bpmStatus != "4") {
    return true;
  }
  return false;
}

/**
 * 增强CSS，可以在页面上输出全局css
 * @param css 要增强的css
 * @param id style标签的id，可以用来清除旧样式
 */
export function cssExpand(css, id) {
  let style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `@charset "UTF-8"; ${css}`;
  // 清除旧样式
  if (id) {
    let $style = document.getElementById(id);
    if ($style != null) $style.outerHTML = "";
    style.id = id;
  }
  // 应用新样式
  document.head.appendChild(style);
}

/** 用于js增强事件，运行JS代码，可以传参 */
// options 所需参数：
//    参数名         类型            说明
//    vm             VueComponent    vue实例
//    event          Object          event对象
//    jsCode         String          待执行的js代码
//    errorMessage   String          执行出错后的提示（控制台）
export function jsExpand(options = {}) {
  // 绑定到window上的keyName
  let windowKeyName = "J_CLICK_EVENT_OPTIONS";
  if (typeof window[windowKeyName] != "object") {
    window[windowKeyName] = {};
  }

  // 随机生成JS增强的执行id，防止冲突
  let id = randomString(16, "qwertyuioplkjhgfdsazxcvbnm".toUpperCase());
  // 封装按钮点击事件
  let code = `
    (function (o_${id}) {
      try {
        (function (globalEvent, vm) {
          ${options.jsCode}
        })(o_${id}.event, o_${id}.vm)
      } catch (e) {
        o_${id}.error(e)
      }
      o_${id}.done()
    })(window['${windowKeyName}']['EVENT_${id}'])
  `;
  // 创建script标签
  const script = document.createElement("script");
  // 将需要传递的参数挂载到window对象上
  window[windowKeyName]["EVENT_" + id] = {
    vm: options.vm,
    event: options.event,
    // 当执行完成时，无论如何都会调用的回调事件
    done() {
      // 执行完后删除新增的 script 标签不会撤销执行结果（已产生的结果不会被撤销）
      script.outerHTML = "";
      delete window[windowKeyName]["EVENT_" + id];
    },
    // 当js运行出错的时候调用的事件
    error(e) {},
  };
  // 将事件挂载到document中
  script.innerHTML = code;
  document.body.appendChild(script);
}

/**
 * 如果值不存在就 push 进数组，反之不处理
 * @param array 要操作的数据
 * @param value 要添加的值
 * @param key 可空，如果比较的是对象，可能存在地址不一样但值实际上是一样的情况，可以传此字段判断对象中唯一的字段，例如 id。不传则直接比较实际值
 * @returns {boolean} 成功 push 返回 true，不处理返回 false
 */
export function pushIfNotExist(array, value, key) {
  for (let item of array) {
    if (key && item[key] === value[key]) {
      return false;
    } else if (item === value) {
      return false;
    }
  }
  array.push(value);
  return true;
}

/**
 * 可用于判断是否成功
 * @type {symbol}
 */
export const succeedSymbol = Symbol();
/**
 * 可用于判断是否失败
 * @type {symbol}
 */
export const failedSymbol = Symbol();

/**
 * 使 promise 无论如何都会 resolve，除非传入的参数不是一个Promise对象或返回Promise对象的方法
 * 一般用在 Promise.all 中
 *
 * @param promise 可传Promise对象或返回Promise对象的方法
 * @returns {Promise<any>}
 */
export function alwaysResolve(promise) {
  return new Promise((resolve, reject) => {
    let p = promise;
    if (typeof promise === "function") {
      p = promise();
    }
    if (p instanceof Promise) {
      p.then((data) => {
        resolve({ type: succeedSymbol, data });
      }).catch((error) => {
        resolve({ type: failedSymbol, error });
      });
    } else {
      reject(
        "alwaysResolve: 传入的参数不是一个Promise对象或返回Promise对象的方法"
      );
    }
  });
}

/**
 * 简单实现防抖方法
 *
 * 防抖(debounce)函数在第一次触发给定的函数时，不立即执行函数，而是给出一个期限值(delay)，比如100ms。
 * 如果100ms内再次执行函数，就重新开始计时，直到计时结束后再真正执行函数。
 * 这样做的好处是如果短时间内大量触发同一事件，只会执行一次函数。
 *
 * @param fn 要防抖的函数
 * @param delay 防抖的毫秒数
 * @returns {Function}
 */
export function simpleDebounce(fn, delay = 100) {
  let timer = null;
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 不用正则的方式替换所有值
 * @param text 被替换的字符串
 * @param checker  替换前的内容
 * @param replacer 替换后的内容
 * @returns {String} 替换后的字符串
 */
export function replaceAll(text, checker, replacer) {
  let lastText = text;
  text = text.replace(checker, replacer);
  if (lastText !== text) {
    return replaceAll(text, checker, replacer);
  }
  return text;
}

/**
 * 获取事件冒泡路径，兼容 IE11，Edge，Chrome，Firefox，Safari
 * 目前使用的地方：JEditableTable Span模式
 */
export function getEventPath(event) {
  let target = event.target;
  let path = (event.composedPath && event.composedPath()) || event.path;

  if (path != null) {
    return path.indexOf(window) < 0 ? path.concat(window) : path;
  }

  if (target === window) {
    return [window];
  }

  let getParents = (node, memo) => {
    memo = memo || [];
    const parentNode = node.parentNode;

    if (!parentNode) {
      return memo;
    } else {
      return getParents(parentNode, memo.concat(parentNode));
    }
  };
  return [target].concat(getParents(target), window);
}

/**
 * 根据组件名获取父级
 * @param vm
 * @param name
 * @returns {Vue | null|null|Vue}
 */
export function getVmParentByName(vm, name) {
  let parent = vm.$parent;
  if (parent && parent.$options) {
    if (parent.$options.name === name) {
      return parent;
    } else {
      let res = getVmParentByName(parent, name);
      if (res) {
        return res;
      }
    }
  }
  return null;
}

export function numberConversion(numArr) {
  let num = 0;
  numArr = transferToNumber(numArr);
  numArr = numArr.split("");
  let isStop = false;
  for (let i in numArr) {
    if (numArr[i] == "0") num += 1;
    if (numArr[i] != "0") num = 0;
    if (isStop && num > 3 && numArr[i] == "0") numArr[i] = "";
    if (numArr[i] == "0" && num > 3 && !isStop) {
      numArr[i - 2] = ".";
      numArr[i - 1] = ".";
      numArr[i] = ".";
      isStop = true;
    }
  }
  return numArr.join("");
}

export function getShortText(data, direction = "center", l = 5, r = 4) {
  if (!data) return data;
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
}

export function sortArr(arr, prop, sortType) {
  let newArr = arr.sort(sortBy(prop, sortType ? sortType : null));
  return newArr;
}
export function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
export function sortBy(field, typeArr) {
  return (x, y) => {
    if (isNumber(x[field])) return Number(x[field]) - Number(y[field]);
    if (typeArr == "time") {
      let a = new Date(x[field]).getTime();
      let b = new Date(y[field]).getTime();
      return a - b;
    }
    let val1 = x[field] == typeArr ? 0 : 1;
    let val2 = y[field] == typeArr ? 0 : 1;
    return val1 - val2;
  };
}
// export function toFormat(num, decimal = 4) {
//   let x = BigNumber(num)
//   return x.toFormat()
// }

export function floatNumber(num, len = 4) {
  let n = null;
  if (!num) return num;
  if (isNumber(num)) {
    n = num.toFixed(len);
  }

  return n;
}

export function linkOtherPage(type, token) {
  let typeArr = [
    {
      url: "https://bscscan.com/",
      type: "etherscan",
    },
    {
      url: "https://bscscan.com/tx/",
      type: "etherscan-tx",
    },
  ];
}

// 复制黏贴
// 复制成功时的回调函数
export function onCopySusses() {
  ElMessage({
    message: "复制成功",
    type: "success",
  });
}
// 复制失败时的回调函数
export function onCopyError() {
  ElMessage({
    message: "复制失败",
    type: "error",
  });
}

export function sringNumber(num) {
  if (!num) return "";

  if (`${Number(num)}`.indexOf("e") == -1) return `${num}`;
  return transferToNumber(num, false);
}
export function transferToNumber(inputNumber, isSub = true) {
  if (!inputNumber) return inputNumber;

  if (isNaN(inputNumber)) {
    return inputNumber;
  }
  inputNumber = "" + inputNumber;
  inputNumber = parseFloat(inputNumber);
  let eformat = inputNumber.toExponential(); // 转换为标准的科学计数法形式（字符串）
  let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/); // 分离出小数值和指数值
  let len = Math.abs(tmpArray[2]);

  let number = inputNumber.toFixed(
    Math.max(0, (tmpArray[1] || "").length - tmpArray[2])
  );
  if (number.indexOf(".") == -1 || len <= 4) return number;
  if (tmpArray["input"].indexOf("e") != -1) {
    if (isSub) {
      let i = number.indexOf(".");
      number =
        number.substring(0, i + 2) +
        "..." +
        number.substring(len + i - 1, number.length);
    }
  }
  return number;
}

export function arraySlice(array, sliceNum) {
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
}
export function priceInit(price, len = 18, isString = true) {
  let pow = Math.pow(10, len);
  let num = new Number(price / pow);
  return isString ? num.toLocaleString() : num.toFixed();
}

export function numberDecimals(price, len = 18) {
  let pow = Math.pow(10, len);
  let num = pow * price;
  return num;
}

// 图标跳转操作
const iconUrl = [
  { type: "icon_etherscan", url: "https://bscscan.com/token/" },
  { type: "etherscan-tx", url: "https://bscscan.com/tx/" },
];
export function editIcon(options) {
  let { type, id, isOpenNew = true } = options;
  let { url } = iconUrl.find((item) => item.type == type);
  url = url + id;
  window.open(url);
}

export function filter_identical(arr, name) {
  var map = arr.reduce(
    (p, c) => [(p[c[name]] = p[c[name]] || []), p[c[name]].push(c), p][2],
    {}
  );
  var result = Object.keys(map).map((i) => map[i]);
  let new_result = [];
  for (let i in result) {
    new_result.push({
      title: result[i][0][name],
      data: result[i],
    });
  }
  return new_result;
}

export const mix = (color1, color2, weight) => {
  weight = Math.max(Math.min(Number(weight), 1), 0);
  let r1 = parseInt(color1.substring(1, 3), 16);
  let g1 = parseInt(color1.substring(3, 5), 16);
  let b1 = parseInt(color1.substring(5, 7), 16);
  let r2 = parseInt(color2.substring(1, 3), 16);
  let g2 = parseInt(color2.substring(3, 5), 16);
  let b2 = parseInt(color2.substring(5, 7), 16);
  let r = Math.round(r1 * (1 - weight) + r2 * weight);
  let g = Math.round(g1 * (1 - weight) + g2 * weight);
  let b = Math.round(b1 * (1 - weight) + b2 * weight);
  r = ("0" + (r || 0).toString(16)).slice(-2);
  g = ("0" + (g || 0).toString(16)).slice(-2);
  b = ("0" + (b || 0).toString(16)).slice(-2);
  return "#" + r + g + b;
};

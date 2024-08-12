import BigNumber from 'bignumber.js'

// 字符串超长截取省略号显示
function ellipsis(value, vlength = 25) {
  if (!value) {
    return ''
  }
  if (value.length > vlength) {
    return value.slice(0, vlength) + '...'
  }
  return value
}

/**
 * 数字格式化 （1234567890 --> 1,234,567,890）
 * @param num 数值
 */
function toThousandslsFilter(num, digits) {
  return (+num || 0)
    .toFixed(digits || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// 判断数据格式-->小数点后两位
function matchDecimal2(num) {
  return /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{0,2})))$/.test(num)
}

// 保留小数位
function decimal_place(value, num) {
  if (!value) return
  let v = value
  if (Object.prototype.toString.call(value) === '[object String]') {
    v = v * 1
  }
  return v.toFixed(num)
}
// 金额分转元
function toYuan(num) {
  num = num * 0.01 //分到元
  num = num.toString() //转成字符串
  if (num.split('.').length < 2) {
    num += '.00'
  } else {
    if (num.split('.')[1].length < 2) num += '0'
  }
  let reg =
    num.indexOf('.') > -1
      ? /(\d{1,3})(?=(?:\d{3})+\.)/g
      : /(\d{1,3})(?=(?:\d{3})+$)/g
  return num.replace(reg, '$1,')
}

// 银行卡格式化
function bankcard_format(str) {
  if (!str || str === '') return
  if (typeof str == 'number') str = str.toString()
  const begin = str.substr(0, 4)
  const end = str.slice(str.length - 4, str.length)
  return begin + ' ****** ' + end
}

// 银行卡尾号（4位）
function bankcard_digits(str) {
  if (!str || str == '') return
  if (typeof str == 'number') str = str.toString()
  return str.substr(str.length - 4, str, length)
}

function textNumber(num) {
  return num * 100
}
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = changeDateNumber(date.getMonth() + 1) + '-'
  var D = changeDateNumber(date.getDate()) + ' '
  var h = changeDateNumber(date.getHours()) + ':'
  var m = changeDateNumber(date.getMinutes()) + ':'
  var s = changeDateNumber(date.getSeconds())
  return Y + M + D + h + m + s
}
function changeDateNumber(num) {
  num = parseInt(num)
  return num < 10 ? `0${num}` : num
}

function priceInit(price, len = 18, isString = true) {
  let pow = Math.pow(10, len)
  let num = new Number(price / pow)
  return isString ? num.toLocaleString() : num.toFixed()
}
function numberSring(num) {
  return new Number(num).toLocaleString()
}
function sringNumber(num) {
  if (!num) return ''

  if (`${Number(num)}`.indexOf('e') == -1) return `${num}`
  return transferToNumber(num, false)
}
function isp(inputNumber) {
  if (!inputNumber) return inputNumber

  if (isNaN(inputNumber)) {
    return inputNumber
  }
  inputNumber = '' + inputNumber
  inputNumber = parseFloat(inputNumber)
  let eformat = inputNumber.toExponential() // 转换为标准的科学计数法形式（字符串）
  let tmpArray = eformat.match(/\d(?:\.(\d*))?e([+-]\d+)/) // 分离出小数值和指数值
}
function transferToNumber(inputNumber, isSub = true) {
  if (!inputNumber) return inputNumber

  if (isNaN(inputNumber)) {
    return inputNumber
  }
  let number = BigNumber(inputNumber)
  number = number.toFixed()
  let len = number.length
  if (number.indexOf('.') == -1 || len <= 4) return number
  if (isSub) {
    let i = number.indexOf('.')
    let k = zeroNumber(number)
    number =
      number.substring(0, i + 2) +
      `${`{${k}}`}` +
      number.substring(k + i + 2, k + i + 2 + 3)
  }
  return number
}
function zeroNumber(z) {
  let zArr = z.split('')
  let k = 0
  zArr.reduce((pre, cur) => {
    if (pre == '0' && cur == '0') k += 1
    return cur
  })
  return k
}

function toFormat(num, decimal = 4) {
  let x = BigNumber(num)
  let n = decimal == 0 || x.isInteger() ? x.toFormat() : x.toFormat(decimal)

  return n
}

function decimalPlaces(num, decimal = 4) {
  let x = BigNumber(num)
  return x.decimalPlaces(decimal)
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatTimetimestamp(timestamp, format) {
  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  let returnArr = []
  let date = new Date(timestamp) //13位的时间戳,    如果不是13位的,  就要乘1000,就像这样 let date = new Date(timestamp*1000)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second)
  returnArr = returnArr.map(formatNumber)
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

function getShortText(data, direction = 'center', l = 5, r = 4) {
  if (!data || data.length <= 9) return data
  if (typeof data != 'string') return data
  let text = ''
  if (direction == 'center') {
    text = `${data.substring(0, l)}...${data.substring(
      data.length - r,
      data.length
    )}`
  } else if (direction == 'left') {
    text = `.....${data.substring(data.length - 10, data.length)}`
  }
  return text
}
function getFirstName(text) {
  let t = text.substring(0, 1)
  return t.toUpperCase()
}
function formatDecimal(num, decimal = 4) {
  num = num.toString()
  let dIndex = num.indexOf('.')
  let str = num.substring(dIndex + 1, num.length)
  if (dIndex !== -1 && str > 4) {
    num = num.substring(0, decimal + dIndex + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

function formatData(ndata, l = 4, r, direction) {
  if (!ndata) return ndata
  var regu = /^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/
  if (regu.test(ndata)) {
    let ndataSring = ndata.toString()
    let dIndex = ndataSring.indexOf('.')
    if (dIndex != -1) {
      if (`${Number(ndata)}`.indexOf('e') == -1) {
        if (isLastZero(ndataSring, dIndex).type) {
          return isLastZero(ndataSring, dIndex).numberText
        }
        return formatDecimal(ndata, l)
      } else {
        return transferToNumber(ndata)
      }
    } else {
      return parseFloat(ndata)
    }
  } else {
    return getShortText(ndata, direction, l, r)
  }
}
function isLastZero(ndataSring, dIndex) {
  let info = {
    type: false,
    numberText: '',
  }
  let t = ndataSring.substring(dIndex + 1, ndataSring.length)
  if (Number(t) == 0)
    return (info = { type: true, numberText: parseInt(ndataSring) })
  let aLen = dIndex + 5
  let bLen = dIndex + 6

  let aStr = ndataSring.substring(dIndex + 1, aLen)
  let bStr = ndataSring.substring(dIndex + 1, bLen)

  if (Number(aStr) == 0) {
    info.type = true
    info.numberText =
      ndataSring.substring(0, dIndex + 2) +
      '..' +
      ndataSring.substring(aLen - 1, aLen + 3)
  }
  if (Number(bStr) == 0) {
    info.type = true
    info.numberText =
      ndataSring.substring(0, dIndex + 2) +
      '..' +
      ndataSring.substring(bLen - 1, bLen + 3)
  }
  return info
}

export default {
  bankcard_digits,
  bankcard_format,
  toYuan,
  ellipsis,
  textNumber,
  timestampToTime,
  numberSring,
  transferToNumber,
  getShortText,
  formatDecimal,
  getFirstName,
  formatData,
  sringNumber,
  priceInit,
  toFormat,
  formatTimetimestamp,
}

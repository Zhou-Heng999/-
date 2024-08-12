// api自动化导入
import camelCase from "lodash/camelCase";
const requireModule = import.meta.globEager("./*.js");
const apis = {};
for (let fileName in requireModule) {
  // if (fileName === "./index.js") return false;
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ""));
  apis[moduleName] = requireModule[fileName];
}
export default apis;

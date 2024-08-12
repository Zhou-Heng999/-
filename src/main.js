import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router/index.js";
import "@/assets/iconfont/iconfont.css";
import "@/assets/iconfont/iconfont.js";
import "@/assets/style/index.scss";
import "element-plus/dist/index.css";
import api from "./api/index.js";
import mixins from "@/mixins/list.js";
import store from "@/store";
import i18n from "./locales/index";

import tableModal from "@/components/table/index.vue";
import searchBar from "@/components/SearchBar/index.vue";
import qlTag from "@/components/tag/index.vue";
import { setImageUrl } from "@/utils/util";
const { getTypeOption, upTableList } = mixins();

const app = createApp(App);
app.component("tableModal", tableModal);
app.component("searchBar", searchBar);
app.component("qlTag", qlTag);
app.config.globalProperties.$api = api;
app.config.globalProperties.$store = store;
app.config.globalProperties.$getTypeOption = getTypeOption;
app.config.globalProperties.$upTableList = upTableList;
app.config.globalProperties.$imgeUrl = import.meta.env.VITE_IMAGE_URL;
app.config.globalProperties.$setImageUrl = setImageUrl;
app.use(i18n).use(Router).mount("#app");

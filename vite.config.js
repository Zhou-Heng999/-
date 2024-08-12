import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "path";
// https://vitejs.dev/config/
// const project = ({ mode }) => {
//   return );
// };

// 定义一个函数，读取.env文件中的内容
async function getEnvConfig(vite_env_key) {
  const envFilePath = path.resolve(__dirname, "./.env");
  const [notExistEnvFile, existEnvFile] = await fsState(envFilePath)
    .then((data) => [null, data])
    .catch((e) => [e, null]);

  if (notExistEnvFile || existEnvFile.size <= 0) return;

  const envContent = await readFile(envFilePath, "utf8");

  if (!envContent) return;

  const envContentArr = envContent
    .split("\n")
    .filter((str) => !str.startsWith("#")) // 过滤掉注释行
    .filter(Boolean);

  const resultKey = envContentArr.find((item) => item.includes(vite_env_key));

  return resultKey ? resultKey.split("=")[1] : null;
}
const resolveConf = () => {
  console.log(
    'getEnvConfig("VITE_PROXY_URL"',
    getEnvConfig("VITE_APP_BASE_URL")
  );

  return {};
};
export default defineConfig({
  lintOnSave: false,
  productionSourceMap: false,
  base: "./",
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      view: path.resolve(__dirname, "src/view"),
      components: path.resolve(__dirname, "src/components"),
      assets: path.resolve(__dirname, "src/assets"),
      store: path.resolve(__dirname, "src/store"),
      mixins: path.resolve(__dirname, "src/mixins"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: loadEnv("development", process.cwd()).VITE_APP_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace("/api", ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});

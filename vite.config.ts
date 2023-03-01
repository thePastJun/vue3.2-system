import { defineConfig, loadEnv, UserConfig, ConfigEnv } from "vite";
// import path from "path";
import { resolve } from 'path';
import { wrapperEnv } from "./build/utils";
import { createProxy } from "./build/proxy";
import { OUTPUT_DIR } from "./build/constant";
import { createVitePlugins } from './build/vite/plugin';
import pkg from './package.json';
import { format } from 'date-fns';
const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const {
    VITE_PUBLIC_PATH,
    VITE_DROP_CONSOLE,
    VITE_PORT,
    VITE_GLOB_PROD_MOCK,
    VITE_PROXY,
  } = viteEnv;
  const prodMock = VITE_GLOB_PROD_MOCK;
  console.log(viteEnv, 'viteEnv')
  // 判断是prod还是dev
  const isBuild = command === "build";

  return {
    plugins: createVitePlugins(viteEnv, isBuild, prodMock),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    base: VITE_PUBLIC_PATH,
    resolve: {
      // 配置路径别名
      // alias: {
      //   "@": path.resolve(__dirname, "src"),
      // },
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
      ],
      dedupe: ['vue'],
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      target: "es2015",
      cssTarget: "chrome80",
      outDir: OUTPUT_DIR,
      minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: VITE_DROP_CONSOLE,
      //     drop_debugger: true
      //   },
      // },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
});

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite"
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite';
import path from 'path';

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vite.dev/config/
export default defineConfig({


  plugins: [
    vue(),
     //element按需导入
    AutoImport({
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ['vue', 'vue-router'],
      dts: "src/auto-import.d.ts",
      //element
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      //element
      resolvers: [ElementPlusResolver()],
      //默认存放位置
      //dts: "src/components.d.ts",
    }),



  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
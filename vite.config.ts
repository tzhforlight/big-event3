import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 导入自动导入插件
import Components from 'unplugin-vue-components/vite'
// 导入自动导入工具函数的插件
import AutoImport from 'unplugin-auto-import/vite'
// 导入 Element Plus 的解析器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 导入用于自动导入样式的插件（可选，但推荐）
// import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // 自动导入工具函数
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 自动导入 Element Plus 组件
      resolvers: [
        ElementPlusResolver(),
        // 也可以在这里添加其他UI库的解析器
      ],
      // 生成 `components.d.ts` 全局组件声明文件，对 TypeScript 支持很重要
      dts: true,
    }),
    // 自动导入 Element Plus 组件的样式 (替代全局引入 `index.css`)
    // ElementPlus({
    //   // 需要额外导入某些非组件的样式，可以在这里配置
    //   // useSource: true,
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

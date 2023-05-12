import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { AntdResolve, createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    base: '/chargingAdmin/web/', //
  //   assetsDir: './assert', // 静态资源路径
  },
  server: {
    port: 8080,
    host:'0.0.0.0',
    // 反向代理
    proxy: {
      '/api': {
        target: 'http://192.168.0.109:16000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    // vxe-table 按需加载
    createStyleImportPlugin({
      resolves: [VxeTableResolve(), AntdResolve()]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
})

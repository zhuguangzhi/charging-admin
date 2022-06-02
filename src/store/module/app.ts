// store.js
import { defineStore } from "pinia"
import { ConfigProvider } from 'ant-design-vue'

export default defineStore({
  id: "app",
  state: ()=> ({
    theme: 'dark',
    layout: 'sider', // header | sider
    menuData: []
  }),
  actions: {
    setMenuData(menuData: any) {
      this.menuData = menuData
    },
    setTheme(theme: string) {
      this.theme = theme
    },
    setLayout(layout: string) {
      this.layout = layout
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true
  }
})

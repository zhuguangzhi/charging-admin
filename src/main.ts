import { createApp } from 'vue'
import App from './App.vue'
import init from './core/use'
import rules from "@/common/rules";
const app = createApp(App)

init(app)
app.mount('#app')
app.config.globalProperties.$window = window
app.config.globalProperties.$Rules = rules

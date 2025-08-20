import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

 import router from "./routes/index.ts"; //引入路由 都是自己下载的，vite似乎没有，下了sass


 
import { createPinia } from 'pinia' 
const pinia = createPinia()//引入状态管理


const app = createApp(App)
app.use(pinia)

 app.use(router)
app.mount('#app')

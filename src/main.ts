import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router,{ setupRouter }  from '@/router'
import { setupStore } from '@/store'

async function bootstrap() {
    const app = createApp(App);
    app.use(ElementPlus)
    // 挂载状态管理
    setupStore(app);
  
    // 挂载路由
    setupRouter(app);
  
    // 路由准备就绪后挂载 APP 实例
    // https://router.vuejs.org/api/interfaces/router.html#isready
    await router.isReady();
  
    app.mount('#app', true);
  }
  
  void bootstrap();






// const app = createApp(App)
// app.use(ElementPlus)
// // app.use(setupStore)
// setupStore(app)
// // 挂载路由
// setupRouter(app)
// await router.isReady()
// app.mount('#app')


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins'
// 导入axios
import axios from 'axios'
// 配置axios的基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过原型挂载的方式将axios挂在给vue，让单文件组件（vue实例）可以访问vue上挂载的属性
Vue.prototype.$http = axios
// 以下是完整引入
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

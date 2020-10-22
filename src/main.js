import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/global.css'
// 导入axios
import axios from 'axios'
// 配置axios的基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过原型挂载的方式将axios挂在给vue，让单文件组件（vue实例）可以访问vue上挂载的属性
Vue.prototype.$http = axios
// axios请求拦截器中挂载token令牌
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}),
  Vue.filter('dateFormate', function(val) {
    let date = new Date(val)
    let yy = date.getFullYear()
    let MM = date.getMonth() + 1
    let dd = date.getDate()
    let hh = date.getHours()
    let mm = date.getMinutes()
    let ss = date.getSeconds()
    return `${yy}-${MM}-${dd}  ${hh < 10 ? '0' + hh : hh}:${mm < 10 ? 'mm' : mm}:${ss < 10 ? '0' + ss : ss}`
  })
// 以下是完整引入
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)
;(Vue.config.productionTip = false),
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')

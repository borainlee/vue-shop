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
// 导入nprogress
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入富文本框
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
// 注册富文本框
Vue.use(VueQuillEditor)
// 导入momentjs
import moment from 'moment'
// 注册使用
// Vue.use(TableTree)
Vue.component('TableTree', ZkTable)
// 配置axios的基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
sessionStorage.setItem('baseUrl', 'http://127.0.0.1:8888/api/private/v1/')
// 通过原型挂载的方式将axios挂在给vue，让单文件组件（vue实例）可以访问vue上挂载的属性
Vue.prototype.$http = axios
// axios请求拦截器中挂载token令牌
axios.interceptors.request.use(config => {
  // 开启nprogress
  Nprogress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
}),
  // axios响应拦截器
  axios.interceptors.response.use(response => {
    // 开启nprogress
    Nprogress.done()
    return response
  }),
  // 定义一个全局时间过滤器
  Vue.filter('dateFormat', function(val, str) {
    // const date = new Date(val)
    // const yy = date.getFullYear()
    // const MM = (date.getMonth() + 1).toString().padStart(2, 0)
    // const dd = date
    //   .getDate()
    //   .toString()
    //   .padStart(2, 0)
    // const hh = date.getHours()
    // const mm = date.getMinutes()
    // const ss = date.getSeconds()
    // return `${yy}-${MM}-${dd}  ${hh < 10 ? '0' + hh : hh}:${mm < 10 ? 'mm' : mm}:${ss < 10 ? '0' + ss : ss}`
    return moment(val).format(str)
  })
// 以下是完整引入
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)
;(Vue.config.productionTip = false),
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')

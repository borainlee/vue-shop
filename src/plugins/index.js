import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Aside, Button, Container, Form, FormItem, Header, Input, Main, Menu, MenuItem, Message, MessageBox, Submenu } from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
// 原型方式挂载message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

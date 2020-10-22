import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Col,
  Container,
  Dialog,
  Form,
  FormItem,
  Header,
  Input,
  Main,
  Menu,
  MenuItem,
  Message,
  MessageBox,
  Option,
  Pagination,
  Row,
  Select,
  Submenu,
  Switch,
  Table,
  TableColumn,
  Tag,
  Tooltip,
  Tree
} from 'element-ui'
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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use(Option)
Vue.use(Select)
// 原型方式挂载message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

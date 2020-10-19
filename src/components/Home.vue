<template>
    <el-container class="home_container">
  <el-header>
    <div>
    <div class="left">
      <img src="../assets/7b55d984d28a9738e43ab44fff3f82fe.jpg" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
    </div>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse? '65px' :'200px'">
      <div class="toggle_bar" @click="isCollapse = !isCollapse" v-text="isCollapse? zk:sq"></div>
      <el-menu
      :default-active="activePath"
      background-color = "#333744"
      text-color="#fff"
      active-text-color="#409eff"
      :unique-opened="true"
      router
      :collapse="isCollapse"
      :collapse-transition="false"
      >
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item 
          :index="'/'+ subItem.path" 
          v-for="subItem in item.children" 
          :key="subItem.id"
          @click="getPath('/'+ subItem.path)"
          >
          <span class="el-icon-menu"></span>
          {{subItem.authName}}</el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <!-- 子路由占位 -->
    <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return {
      // 左侧权限列表
      menulist:[],
      // 定义字体对象
      iconsObj:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      // 激活的菜单项目
      activePath:'',
      // 控制左侧菜单的折叠
      isCollapse:false,
      zk: '展开',
      sq: '收起'
    }
  },
  // 钩子函数，尽早访问到methods中的方法和data中的数据
  created() {
    this.getMenus()
    this.activePath = sessionStorage.getItem('path')
  },
methods: {
     async logout() {
      const res = await this.$confirm('您确认退出登录吗', '提示',
         {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err)
        console.log(res);
        if(res !== 'confirm') 
        // 点击取消按钮
        return this.$message.info('已取消退出')
        // 点击确认按钮
        this.$message.success('账号已退出')
        // 清除本地存储
        sessionStorage.clear()
        // 回到登陆页面
        this.$router.push('/login')
      },
     // 获取左侧菜单列表数据
     async getMenus(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200){
        return this.$message.error('获取菜单列表失败')
      }
      this.menulist = res.data
      console.log(this.menulist);
     },
    //  点击赋值activePath
     getPath(path){
      //  console.log(path);
       this.activePath = path
      //  本地存储将激活的链接path信息保存
      sessionStorage.setItem('path',path)
     },
  }
}
</script>

<style lang="less" scoped>
  .home_container {
    height: 100%;
  }
  .el-header {
    height: 60px;
    background-color: #373d41;
    >div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      vertical-align: middle;
      height: 60px;
    }
    span {
      font-size: 20px;
      color: #fff;
      margin-left: 15px;
    }
  }
  }
 
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle_bar {
    height: 20px;
    line-height: 20px;
    background-color: #4a5064;
    color: #fff;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
</style>
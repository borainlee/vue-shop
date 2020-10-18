<template>
<div class="container">
  <!-- 整个登录容器 -->
  <div class="login_container">
    <!-- logo区域 -->
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <!-- 表单数据区域 -->
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
      <!-- 账号 -->
  <el-form-item prop="username">
    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
  </el-form-item>
  <!-- 密码 -->
    <el-form-item prop="password">
    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
  </el-form-item>
  <!-- 按钮 -->
   <el-form-item class="btns">
    <el-button type="primary" @click="login">登录</el-button>
    <el-button type="info"  @click="resetForm">重置</el-button>
  </el-form-item>
  </el-form>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username:'',
        password:''
      },
      loginFormRules:{
         username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
           password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
      },
    }
  },
  methods:{
    // 重置表单内容和表达的校验规则
        resetForm() {
          this.$refs.loginFormRef.resetFields()
      },
      // 登录的方法
      login(){
        // 表单的预校验
        this.$refs.loginFormRef.validate( async boo=>{
           if (!boo) {
           return this.$message.error('请输入合法的用户名和密码');
          } else {
            // 发送请求
           const {data:res} = await this.$http.post('login',this.loginForm)
           if(res.meta.status !== 200)
           return this.$message.error('登录失败')
           this.$message.success('登录成功')
          //  编程式导航跳转到home页面
          this.$router.push('/home')
          // 将服务器返回token令牌储存到本地
          }
        })
      }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .login_container{
    display: flex;
    align-items: flex-end;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 320px;
    background-color: #fff;
    transform: translate(-50%,-50%);
    border-radius: 10px;
    box-shadow: 2px 2px 10px #ddd;
    .logo{
      position: absolute;
      left: 50%;
      top: -75px;
      padding: 10px;
      transform: translate(-50%);
      width: 130px;
      height: 130px;
      background-color: #fff;
      box-shadow: 2px 2px 10px #ddd;
      border: 1px solid #efefef;
      border-radius: 50%;
      img{
        width: 100%;
        background-color: #efefef;
        border-radius: 50%;
      }
    }
    .el-form {
      width: 100%;
      padding: 0 20px;
      .btns {
        text-align: right;
      }
    }
  }
}
</style>
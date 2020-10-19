<template>
  <div><el-button type="info" @click="logout">退出</el-button></div>
</template>

<script>
export default {
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
      }
}
}
</script>

<style>

</style>
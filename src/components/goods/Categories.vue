<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加商品</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 20,
      },
      catCategoryList: [],
      // 总数
      total: 0,
    }
  },
  methods: {
    // 获取商品分类的方法
    async getCategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.message.error('获取商品分类失败')
      }
      this.catCategoryList = res.data.result
      this.total = res.data.total
    },
  },
  created() {
    this.getCategories()
  },
}
</script>

<style>
</style>
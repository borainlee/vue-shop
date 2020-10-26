<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="700px"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="goods_weight"
          label="商品重量"
        ></el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="scope">
            {{
              Number(scope.row.add_time + '000')
                | dateFormat('YYYY-MM-DD HH:mm:ss')
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              class="el-icon-edit"
              type="primary"
            ></el-button>
            <el-button
              size="mini"
              class="el-icon-delete"
              type="danger"
              @click="deletegoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表的查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      goodsList: [],
      // 总数
      total: 0,
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.total)
    },
    // 删除商品
    async deletegoodById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发送请求
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      //如果只剩一条数据，pagenum--
      if (this.total % this.queryInfo.pagesize === 1) {
        this.queryInfo.pagenum--
      }
      this.getGoodsList()
    },
    // pagesize发生修改触发的函数
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      // 重新获取
      this.getGoodsList()
    },
    // pagenum发生修改触发的函数
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      // 重新获取
      this.getGoodsList()
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>

<style>
</style>

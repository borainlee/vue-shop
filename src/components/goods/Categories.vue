<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button class="btn" type="primary" @click="getCatelist"
        >添加分类</el-button
      >
      <!-- 表格 -->
      <table-tree
        :data="catCategoryList"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="#"
        border
        stripe
        :expand-type="false"
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="is_delete" scope="scope">
          <span
            class="el-icon-success success"
            v-if="scope.row.cat_deleted === false"
          ></span>
          <span class="el-icon-error error" v-else></span>
        </template>
        <!-- 等级 -->
        <template slot="level" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" class="el-icon-edit" type="primary"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" class="el-icon-delete"
            >删除</el-button
          >
        </template>
      </table-tree>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateClosed"
    >
      <el-form
        label-width="80px"
        ref="addCatFormRef"
        :model="addCatForm"
        :rules="addCatRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="checkedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
        pagesize: 5,
      },
      catCategoryList: [],
      // 总数
      total: 0,
      columns: [
        {
          // 列的标题
          label: '分类名称',
          // 列的字段
          prop: 'cat_name',
        },
        {
          // 列的标题
          label: '是否有效',
          // 指定当前列为自定义模板列
          type: 'template',
          // 自定义模板列的名称
          template: 'is_delete',
        },
        {
          // 列的标题
          label: '排序',
          // 指定当前列为自定义模板列
          type: 'template',
          // 自定义模板列的名称
          template: 'level',
        },
        {
          // 列的标题
          label: '操作',
          // 指定当前列为自定义模板列
          type: 'template',
          // 自定义模板列的名称
          template: 'opt',
        },
      ],
      addCateDialogVisible: false,
      // // 添加分类的对象
      addCatForm: { cat_name: '', cat_pid: 0, cat_level: 0 },
      // // 添加分类名称的校验规则
      addCatRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 级联选择框的数据源 二级
      cateList: [],
      // 级联选择框选中的数据是一个数组
      checkedKeys: [],
      // 级联选择框的配置信息对象
      cascaderProps: {
        expandTrigger: 'hover',
        // 选择之后提交的数据(id)
        value: 'cat_id',
        // 展示给用户看的数据
        label: 'cat_name',
        // 子项与父项的关联属性
        children: 'children',
        // 设置父子节点不关联
        checkStrictly: true,
      },
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
    // 分页pagesize发生修改的方法
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCategories()
    },
    // 分页pagenum发生修改的方法
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getCategories()
    },
    // 只获取二级分类
    async getCatelist() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
      this.addCateDialogVisible = true
    },
    // 对话框关闭，重置表单，清空级联选择框选中的数组
    addCateClosed() {
      this.$refs.addCatFormRef.resetFields()
      this.checkedKeys = []
      this.addCatForm.cat_level = this.addCatForm.cat_pid = 0
    },
    // 级联选择框发生修改会触发的事件
    handleChange() {
      console.log(this.checkedKeys)
    },
    // 添加商品分类的方法
    addCate() {
      // 1.预校验
      this.$refs.addCatFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) {
          return this.$message.error('请输入或选中商品分类')
        }
        // 2.判断cat_pid是多少
        // 级联选择框有被选中，获取级联选择框的最后一项的数组元素，如果数组为空 cat_pid的值为0
        if (this.checkedKeys.length === 0) {
          this.addCatForm.cat_pid = 0
        } else {
          this.addCatForm.cat_pid = this.checkedKeys[
            this.checkedKeys.length - 1
          ]
        }
        // console.log(this.addCatForm.cat_pid)
        // console.log(this.addCatForm)
        // 3.判断cat_level是第几级 级联选择框没有被选择cat_level为0
        // 级联选择框关联的数组长度为0，一级分类(cat_level为0)
        // 级联选择框关联的数组长度为1，一级分类(cat_level为1)
        // 级联选择框关联的数组长度为2，一级分类(cat_level为2)
        this.addCatForm.cat_level = this.checkedKeys.length
        const { data: res } = await this.$http.post(
          'categories',
          this.addCatForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类失败')
        }
        this.$message.success('添加商品分类成功')
        this.getCategories()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
    },
  },
  created() {
    this.getCategories()
  },
}
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 20px;
}
.success {
  color: lightgreen;
}
.error {
  color: red;
}
.el-cascader {
  width: 100%;
}
</style>
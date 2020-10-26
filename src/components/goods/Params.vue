<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <div class="cascader_box">
        选择商品分类：
        <el-cascader
          v-model="checkedKeys"
          :options="cateList"
          :props="cascaderProps"
          @change="handleChange"
        ></el-cascader>
      </div>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isdisable"
            @click="addAttributeVisible = true"
            >添加参数</el-button
          >
          <!-- 添加动态参数的表格 -->
          <el-table :data="tableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="removeAttr(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-edit"
                  @click="getParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  class="el-icon-delete"
                  @click="removeCateById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            :disabled="isdisable"
            @click="addAttributeVisible = true"
            >添加属性</el-button
          >
          <!-- 添加静态属性的表格 -->
          <el-table :data="tableData" style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="removeAttr(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  class="el-icon-edit"
                  @click="getParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  class="el-icon-delete"
                  @click="removeCateById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数和属性的对话框 -->
    <el-dialog
      :title="'添加' + str"
      :visible.sync="addAttributeVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item :label="str" prop="attr_name">
          <el-input v-model="addCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数和属性的对话框 -->
    <el-dialog
      :title="'编辑' + str"
      :visible.sync="editAttributeVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item :label="str" prop="attr_name">
          <el-input v-model="editCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttributeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      // 级联选择框选中之后的数据
      checkedKeys: [],
      // 级联选择框的配置对象
      cascaderProps: {
        // 触发时机
        expandTrigger: 'hover',
        // 展示的数据
        label: 'cat_name',
        // 选中的数据
        value: 'cat_id',
        // 子父项关系
        children: 'children',
      },
      // tabs标签页激活的面板的name值
      activeName: 'many',
      tableData: [],
      // 显示或隐藏添加的对话框
      addAttributeVisible: false,
      // 显示或隐藏编辑的对话框
      editAttributeVisible: false,
      // 添加属性参数的对象
      addCateForm: {
        attr_name: '',
      },
      // 编辑属性参数的对象
      editCateForm: {
        attr_name: '',
      },
      // 添加属性参数的校验规则
      addCateFormRules: {
        attr_name: [
          { required: true, message: '请输入必填项', trigger: 'blur' },
        ],
      },
      // 按钮和输入框的切换
      inputVisible: false,
      // 输入框的双向绑定
      inputValue: '',
    }
  },
  methods: {
    // 定义获取商品分类的方法
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    // 级联选择框触发的方法
    handleChange() {
      this.getAttribute()
    },
    // 获取属性和参数的方法
    async getAttribute() {
      // 如果选择的数组长度不为3，直接将数组清空
      if (this.checkedKeys.length !== 3) {
        this.tableData = []
        this.checkedKeys = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.checkedKeys[2]}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数属性失败')
      }
      // 遍历res.data,将里面的attr_vals转换为数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []
        // 在循环的时候给每一项添加自己的布尔值和输入框绑定的值
        item.inputVisible = false
        item.inputValue = ''
      })
      this.tableData = res.data
    },
    handleClick() {
      this.getAttribute()
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击确定添加参数
    addCate() {
      // 表单预校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填入必写信息')
        }
        // 发送请求
        const { data: res } = await this.$http.post(
          `categories/${this.checkedKeys[2]}/attributes`,
          {
            attr_name: this.addCateForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.getAttribute()
        // 关闭对话框
        this.addAttributeVisible = false
      })
    },
    // 点击编辑按钮查询参数
    async getParams(row) {
      const { data: res } = await this.$http.get(
        `categories/${this.checkedKeys[2]}/attributes/${row.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editCateForm = res.data
      this.editAttributeVisible = true
    },
    editCate() {
      // 表单预校验
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填入必写信息')
        }
        // 发送请求
        const { data: res } = await this.$http.put(
          `categories/${this.checkedKeys[2]}/attributes/${this.editCateForm.attr_id}`,
          {
            attr_name: this.editCateForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败')
        }
        this.$message.success('编辑成功')
        this.getAttribute()
        // 关闭对话框
        this.editAttributeVisible = false
        this.editCateForm = {}
      })
    },
    // 删除参数或属性
    async removeCateById(id) {
      // console.log(id)
      // 询问提示框
      const result = await this.$confirm(
        '此操作将永久删除参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.checkedKeys[2]}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getAttribute()
    },
    // 失去焦点输入框隐藏
    handleInputConfirm(row) {
      // 失去焦点的时候进行attr_val这个数组的追加
      // 非空校验
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)
      // 发送请求
      this.saveAttrVals(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    // 添加删除tag标签的请求
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.checkedKeys[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
    },
    // 点击按钮显示输入框
    showInput(row) {
      row.inputVisible = true
      // this.$nextTick等到下次dom更新之后才触发的函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 移除当前行的tag标签
    removeAttr(row, i) {
      row.attr_vals.splice(i, 1)
      // 发送请求
      this.saveAttrVals(row)
    },
  },
  computed: {
    // 通过计算属性监听数组长度的变化，返回不同的布尔值
    isdisable() {
      return this.checkedKeys.length === 3 ? false : true
    },
    str() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scope="scope">
.cascader_box {
  margin: 20px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 90px !important;
}
</style>
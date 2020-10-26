<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps align-center :active="active - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs标签页 -->
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRed"
      >
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <!-- 第一个pane面板 -->
          <el-tab-pane name="0" label="基本信息">
            <el-form-item prop="goods_name" label="商品名称"
              ><el-input v-model="addForm.goods_name"></el-input
            ></el-form-item>
            <el-form-item prop="goods_price" label="商品价格"
              ><el-input v-model="addForm.goods_price"></el-input
            ></el-form-item>
            <el-form-item prop="goods_weight" label="商品重量"
              ><el-input v-model="addForm.goods_weight"></el-input
            ></el-form-item>
            <el-form-item prop="goods_number" label="商品数量"
              ><el-input v-model="addForm.goods_number"></el-input
            ></el-form-item>
            <el-form-item prop="goods_cat" label="商品分类"
              ><el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handlerChange"
              ></el-cascader
            ></el-form-item>
          </el-tab-pane>
          <!-- 第二个pane面板 -->
          <el-tab-pane name="1" label="商品参数">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 第三个pane面板 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 第四个pane面板 -->
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="actionUrl"
              :headers="tokenObj"
              list-type="picture-card"
              :on-success="onUploadSuccess"
              :on-remove="onRemoveFile"
              :on-preview="onPreview"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览的对话框 -->
      <el-dialog title="图片预览" width="50%" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条绑定的值
      active: '0',
      // 添加商品的对象
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introd: '',
        pics: [],
        attrs: [],
      },
      // 添加商品的校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
      // 级联选择框的数据源
      cateList: [],
      // 级联选择框的配置对象
      cascaderProps: {
        // 展示的参数
        label: 'cat_name',
        // 选中的数据
        value: 'cat_id',
        // 子父项关系
        children: 'children',
        // 触发时机
        expandTrigger: 'hover',
      },
      dialogVisible: false,
      dialogImageUrl: '',
      // 动态参数
      manyData: [],
      // 静态属性
      onlyData: [],
      tokenObj: {
        Authorization: sessionStorage.getItem('token'),
      },
      actionUrl: sessionStorage.getItem('baseUrl') + 'upload',
    }
  },
  methods: {
    async getCateList() {
      try {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.$message.success('获取商品分类成功')
        this.cateList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 级联选择框修改触发的事件
    handlerChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = [])
      }
    },
    beforeLeave(active, oldactive) {
      if (this.addForm.goods_cat.length !== 3 && oldactive === this.active) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClick() {
      if (this.active === '1') {
        this.manyData = await this.getAttribute('many')
        // 将每一项的attr_vals分割为数组
        this.manyData.forEach((item) => {
          item.attr_vals = item.attr_vals.split(' ')
        })
      } else if (this.active === '2') {
        this.onlyData = await this.getAttribute('only')
      }
    },
    async getAttribute(sel) {
      const { data: res } = await this.$http.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        {
          params: { sel },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      return res.data
    },
    // 上传图片后发生的函数
    onUploadSuccess(response) {
      console.log(response.data.tmp_path)
      this.addForm.pics.push({ pic: response.data.tmp_path })
    },
    // 移除图片发生的函数
    onRemoveFile(file) {
      // 获取索引
      const i = this.addForm.pics.findIndex((item) => {
        item.pic === file.response.data.tmp_path
      })
      this.addForm.pics.splice(i, 1)
      console.log(file.response.data.tmp_path)
    },
    // 图片预览
    onPreview(file) {
      this.dialogImageUrl = file.response.data.url
      this.dialogVisible = true
    },
    // 添加商品
    addGoods() {
      // 准备发送请求去添加商品，需要处理两个字段goods_cat attrs
      // 预校验
      this.$refs.addFormRed.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        // 处理manyData
        this.manyData.forEach((item) => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          })
        })
        // 处理onlyData
        this.onlyData.forEach((item) => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          })
        })
        // 不推荐直接修改原数据
        const newAddForm = JSON.parse(JSON.stringify(this.addForm))
        newAddForm.goods_cat = newAddForm.goods_cat.join(',')
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 发送请求
        const { data: res } = await this.$http.post(`goods`, newAddForm)
        if (res.meta.status !== 201) {
          return this.$message.error('创建商品失败')
        }
        this.$message.success('创建商品成功')
        this.$router.push('/good')
      })
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 30px 0;
}
// .quill-editor {
//   height: 343px;
// }
// 深度选择器
/deep/.ql-editor {
  height: 343px;
}
.btnAdd {
  margin-top: 10px;
}
</style>
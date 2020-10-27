<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag v-else type="warning">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="creat_time" label="下单时间">
          <template v-slot="scope">
            {{
              Number(scope.row.create_time + '000')
                | dateFormat('YYYY-MM-DD HH:mm:ss')
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              class="el-icon-edit"
              @click="editDialogVisible = true"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              class="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 编辑对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          ref="editFormRef"
          :model="editForm"
          label-width="80px"
          :rules="editFormRules"
        >
          <el-form-item label="省市区/县">
            <el-cascader
              v-model="checkedKey"
              :options="cityData"
              :props="cityProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 订单列表
      orderList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 总数
      total: 0,
      // 控制编辑的显示和隐藏
      editDialogVisible: false,
      // 编辑表单
      editForm: {
        address: '',
      },
      // 编辑规则
      editFormRules: {
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 级联选择框的值
      cityData,
      // 级联选择框的配置信息
      cityProps: {
        label: 'label',
        value: 'value',
        children: 'children',
        expandTrigger: 'hover',
      },
      checkedKey: [],
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getOrderList()
    },
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getOrderList()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
  },
  created() {
    this.getOrderList()
  },
}
</script>

<style>
</style>
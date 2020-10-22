<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border stripe :data="userList" style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="create_time" label="日期">
          <template slot-scope="scope">
            {{
              Number(scope.row.create_time + '000')
                | dateFormate(scope.row.create_time)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作">
          <!-- 这里template先不放 明天再说 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getUserInfo(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialogById(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户的对话框组件 -->
      <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addUserForm"
          status-icon
          label-width="80px"
          :rules="addFormRules"
          ref="addFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的对话框组件 -->
      <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editUserForm"
          status-icon
          label-width="80px"
          :rules="addFormRules"
          ref="editFormRef"
        >
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>当前的用户名：{{ RoleForm.username }}</p>
          当前角色：{{ RoleForm.role_name }}
          <p>
            分配新角色：<el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义手机号和邮箱的校验规则
    var checkEmail = (rule, value, callback) => {
      const regexp = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
      regexp.test(value) ? callback() : callback(new Error('邮箱格式不正确'))
    }
    var checkMobile = (rule, value, callback) => {
      const regexp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      regexp.test(value) ? callback() : callback(new Error('手机格式不正确'))
    }
    return {
      // 用户列表数据
      userList: [],
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 用户列表总数量
      total: 0,
      // 控制添加用户对话框展示与隐藏的布尔值
      addDialogVisible: false,
      // 控制修改用户对话框展示与隐藏的布尔值
      editDialogVisible: false,
      // 控制分配权限对话框展示与隐藏的布尔值
      setDialogVisible: false,
      // 角色信息对象
      RoleForm: {},
      // 角色列表
      rolesList: [],
      // select中option绑定的值
      value: '',
      // 添加用户的对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 修改用户对象
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 根据id展示分配角色的对话框，查询数据
    async showSetRoleDialogById(row) {
      this.RoleForm = row
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.setDialogVisible = true
    },
    // 关闭对话框，重置对象和select绑定的值
    setRoleDialogClosed() {
      this.value = ''
      this.RoleForm = {}
    },
    // 分配角色
    async setRole() {
      const { data: res } = await this.$http.put(
        `users/${this.RoleForm.id}/role`,
        {
          rid: this.value,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      // 重新获取数据
      this.getUserList()
      // 关闭对话框
      this.setDialogVisible = false
    },
    // 定义请求用户列表数据的方法
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // pagesize发生修改触发的函数
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      // 重新获取
      this.getUserList()
    },
    // pagenum发生修改触发的函数
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      // 重新获取
      this.getUserList()
    },
    // 修改用户状态的方法
    async changeUserState(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('更新状态失败')
        row.mg_state = !row.mg_state
        return
      }
      this.$message.success('更新状态成功')
    },
    // 关闭对话框，重置表单操作--------------------------------------------------------------
    // 关闭添加用户对话框，重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭修改用户对话框，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 根据id查询用户信息
    async getUserInfo(id) {
      // console.log(id);
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      // 将获取到的用户信息保存到data中的eidtUserForm中
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    // 完成修改操作
    editUser() {
      this.$refs.editFormRef.validate(async (boo) => {
        if (!boo) {
          return this.$message.error('请填写完整信息后提交')
        }
        // 发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          }
        )
        // 成功后提示
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.$message.success('更新用户信息成功')
        // 更新视图
        this.getUserList()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 添加用户的方法
    addUser() {
      // 表单预校验
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return this.$message.error('请填写完整信息后提交')
        }
        // 校验通过后发请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        // 成功后提示
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户信息失败')
        }
        this.$message.success('添加用户信息成功')
        // 更新视图
        this.getUserList()
        // 关闭对话框
        this.addDialogVisible = false
      })
    },
    // 删除用户操作
    async deleteUserById(id) {
      const res = await this.$confirm(
        '此操作将永久删除用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: result } = await this.$http.delete('users/' + id)
      if (result.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      //如果只剩一条数据，pagenum--
      if (this.total % this.queryInfo.pagesize === 1) {
        this.queryInfo.pagenum--
      }
      this.getUserList()
    },
  },
  created() {
    this.getUserList()
  },
}
</script>

<style>
.el-table {
  margin-top: 10px;
}
.el-pagination {
  margin-top: 10px;
}
.el-dialog .el-form {
  padding-right: 30px;
}
</style>
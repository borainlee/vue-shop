<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bb', i === 0 ? 'bt' : '']"
              v-for="(item1, i) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="6">
                <el-tag
                  closable=""
                  @close="removeRoleById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="[i === 0 ? '' : 'bt']"
                  v-for="(item2, i) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeRoleById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    ></el-col
                  >
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRoleById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showAddRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话栏 -->
    <el-dialog
      title="分配权限"
      :visible.sync="addRightsDialogVisible"
      width="50%"
      @close="RightsDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRisgts">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 控制分配权限的对话框组件
      addRightsDialogVisible: false,
      // 权限列表数据
      rightsList: [],
      // 树形控件的配置对象
      defaultProps: {
        // 展示在树形控件的显示文本
        label: 'authName',
        // 关联节点
        children: 'children',
      },
      // 默认勾选树形控件已有的权限（id值）
      defaultKeys: [],
      // 存储roleId
      roleId: '',
    }
  },
  methods: {
    // 获取角色列表数据的方法
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    //  移除权限
    async removeRoleById(row, rightId) {
      const result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
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
      // 发送请求，移除权限
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      // 此处没有必要调用重新获取数据的方法了,返回的data已经是最新的数据了
      row.children = res.data
      // this.getRolesList()
    },
    // 显示权限列表
    async showAddRightsDialog(row) {
      // console.log(row.id);
      this.roleId = row.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      // 打开对话框
      this.addRightsDialogVisible = true
      // 加载已有权限
      this.getDefaultKeys(row, this.defaultKeys)
    },
    // 加载已有权限的方法
    getDefaultKeys(element, arr) {
      // 如果没有children节点，说明是三级权限，直接讲三级权限的id往数组里添加
      if (!element.children) {
        return arr.push(element.id)
      }
      // 还有children的节点
      element.children.forEach((item) => {
        return this.getDefaultKeys(item, arr)
      })
    },
    // 当对话框关闭后将数组清空
    RightsDialogClosed() {
      this.defaultKeys = []
    },
    // 授权
    async setRisgts() {
      console.log(this.roleId)
      // 关闭对话框
      this.addRightsDialogVisible = false
      // 获取全选和半选节点的key值
      // console.log(this.$refs.treeRef.getCheckedKeys());
      // console.log(this.$refs.treeRef.getHalfCheckedKeys());
      // 将全选和半选的key拼接为一个数组后转为字符串
      const str = this.$refs.treeRef
        .getCheckedKeys()
        .concat(this.$refs.treeRef.getHalfCheckedKeys())
        .join(',')
      // console.log(str)
      // 发起请求
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: str }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      // 关闭对话框
      this.addRightsDialogVisible = false
    },
  },
  created() {
    // 调用获取角色列表数据的方法
    this.getRolesList()
  },
}
</script>

<style lang="less" scoped>
.bt {
  border-top: 1px solid #ccc;
}
.bb {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin: 10px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
<template>
  <div class="role-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="角色状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="角色名称">
            <el-input v-model="conditionForm.name" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增角色</el-button></div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="角色名称" align="center" />
        <el-table-column prop="code" label="角色编号" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ scope.row.status ? '已启用' : '已停用' }}</div></template>
        </el-table-column>
        <el-table-column prop="time_create" label="创建时间" align="center">
          <template slot-scope="scope"><div>{{ $moment(scope.row.time_create).format("YYYY-DD-MM") }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleStatusChange(scope.$index, scope.row)">{{ scope.row.status ? '停用' : '启用' }}</el-button>
            <el-button slot="reference" size="mini" @click="handleSetPermission(scope.$index, scope.row)">权限设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增角色' : '编辑角色'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="additionForm" :rules="additionFormRules" style="padding-right: 40px;">
        <el-form-item label="角色名称" label-width="100px" prop="name">
          <el-input v-model="additionForm.name" placeholder="请输入部门的名称" />
        </el-form-item>
        <el-form-item label="角色编号" label-width="100px" prop="code">
          <el-input v-model="additionForm.code" placeholder="请输入部门的名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="confirmDialog.dialogFormVisible"
      width="25%"
      center
    >
      <div style="text-align: center">确定要{{ tableData[currentIndex] && tableData[currentIndex].status ? '停用' : '启用' }}{{ tableData[currentIndex] && tableData[currentIndex].name }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => handleBlockUpCancel('confirmDialog')">取 消</el-button>
        <el-button type="primary" @click="() => handleBlockUp('confirmDialog')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="权限设置" :visible.sync="permissionDialog.dialogFormVisible">
      <div>
        <div style="margin-bottom: 15px;">菜单权限</div>
        <el-tree
          ref="tree"
          :data="permissionDialog.menuList"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :default-checked-keys="permissionForm.checkedMenus"
          :props="{children: 'children', label: 'name'}"
          @check-change="handleGetCheckedKeys"
        />
      </div>
      <div>
        <div style="margin: 15px 0;">其他权限</div>
        <el-checkbox v-model="permissionDialog.checkAll" :indeterminate="permissionDialog.isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 6px 0;" />
        <el-checkbox-group v-model="permissionForm.checkedOthers" @change="handleCheckedOthersChange">
          <el-checkbox v-for="item in permissionDialog.others" :key="item.value" :label="item.label">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => handleBlockUpCancel('permissionDialog')">取 消</el-button>
        <el-button type="primary" @click="() => handleBlockUp('permissionDialog')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { fetchRoleList, addRole, roleToggleStatus, fetchMenuList } from '@/api/system-mg'
export default {
  name: 'Role',
  components: {},
  data: function() {
    return {
      permissionDialog: {
        dialogFormVisible: false,
        others: [{
          label: '审核',
          value: '1'
        }, {
          label: '其他',
          value: '-1'
        }],
        isIndeterminate: false,
        checkAll: false,
        menuList: []
      },
      permissionForm: {
        checkedMenus: [],
        checkedOthers: []
      },
      confirmDialog: {
        dialogFormVisible: false
      },
      additionForm: {
        name: '',
        code: '',
        permission: ''
      },
      additionFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
        code: [{ required: true, message: '请输入角色编号', trigger: ['blur'] }]
      },
      dialogConfig: {
        dialogFormVisible: false,
        currentStatus: '' // 当前的状态，编辑（edit）或者是新增（add）
      },
      currentIndex: -1, // 记录当前状态下操作的目标数据的索引
      conditionForm: {
        statusList: [{
          label: '-1',
          value: '全部'
        }, {
          label: '0',
          value: '已停用'
        }, {
          label: '1',
          value: '已启用'
        }],
        status: '-1',
        name: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  computed: {},
  created() {},
  mounted() {
    const dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchRoleList(dataTemp).then(res => {
      console.log('role.vue mounted fetchRoleList success', res)
      this.tableData.push(...res.data.data)
      this.total = res.data.total
    }).catch(err => {
      console.log('role.vue mounted fetchRoleList failure', err)
    })
  },
  methods: {
    handleGetCheckedKeys(item, isSelected, other) {
      console.log('role.vue methods handleGetCheckedKeys', item, isSelected, other)
      this.permissionForm.checkedMenus = this.$refs.tree.getCheckedKeys()
    },
    handleMenuList(target, data) {
      if (target && target.length > 0) {
        for (let i = 0; i < target.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].pid === target[i].id) { // 找到目标元素的children
              if (!target[i].children) {
                target[i].children = []
              }
              target[i].children.push(data[j])
              data.splice(j, 1)
              j--
            }
          }
          this.handleMenuList(target[i].children, data)
        }
        return data
      } else {
        return []
      }
    },
    handleCheckAllChange(val) {
      this.permissionForm.checkedOthers = val ? this.permissionDialog.others.map(item => item.label) : []
      this.permissionDialog.isIndeterminate = false
    },
    handleCheckedOthersChange(value) {
      const checkedCount = value.length
      this.permissionDialog.checkAll = checkedCount === this.permissionDialog.others.length
      this.permissionDialog.isIndeterminate = checkedCount > 0 && checkedCount < this.permissionDialog.others.length
    },
    handleSetPermission(index, row) {
      console.log('role.vue methods handleSetPermission', index, row)
      this.currentIndex = index
      this.permissionDialog.dialogFormVisible = true
      const dataTemp = {
        pageIndex: 1,
        pageSize: 1000
      }
      fetchMenuList(dataTemp).then(res => {
        console.log('menu.vue mounted fetchMenuList success', res)
        const temp = this._.cloneDeep(res.data.data)
        this.handleMenuList(temp, temp)
        this.permissionDialog.menuList.length = 0
        this.permissionDialog.menuList.push(...temp)
        this.$nextTick(() => {
          if (row.permission) {
            this.permissionForm.checkedMenus = JSON.parse(row.permission).checkedMenus
            this.permissionForm.checkedOthers = JSON.parse(row.permission).checkedOthers
            this.handleCheckedOthersChange(this.permissionForm.checkedOthers)
          }
          // this.$refs.tree.setCheckedKeys([8])
        })
      }).catch(err => {
        console.log('menu.vue mounted fetchMenuList failure', err)
      })
    },
    handleBlockUpCancel(type) {
      this.currentIndex = -1
      this[type].dialogFormVisible = false
    },
    handleBlockUp(type) {
      console.log('role.vue methods handleBlockUp', type)
      if (type === 'confirmDialog') {
        const dataTemp = {
          id: this.tableData[this.currentIndex].id,
          status: this.tableData[this.currentIndex].status
        }
        roleToggleStatus(dataTemp).then(res => {
          console.log('role.vue handleBlockUp roleToggleStatus success', res)
          this.refreshView()
          this.handleBlockUpCancel(type)
          Message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(err => {
          console.log('role.vue handleBlockUp roleToggleStatus failure', err)
          Message({
            message: '操作失败',
            type: 'warning',
            duration: 5 * 1000
          })
        })
      } else if (type === 'permissionDialog') {
        const tempData = {
          id: this.tableData[this.currentIndex].id,
          permission: JSON.stringify(this.permissionForm)
        }
        console.log('1111111111', tempData, this.$refs.tree.getCheckedKeys())
        addRole(tempData).then(res => {
          console.log('role.vue handleBlockUp addRole success', res)
          this.refreshView()
          this.handleBlockUpCancel(type)
          Message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        }).catch(err => {
          console.log('role.vue handleBlockUp addRole failure', err)
          Message({
            message: '操作失败',
            type: 'warning',
            duration: 5 * 1000
          })
        })
      }
    },
    handleStatusChange(index, row) {
      console.log('role.vue methods handleStatusChange', index, row)
      this.currentIndex = index
      this.confirmDialog.dialogFormVisible = true
    },
    handleRadioGroupChange(val) {
      console.log('role.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchRoleList(dataTemp).then(res => {
        console.log('role.vue mounted fetchRoleList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('role.vue mounted fetchRoleList failure', err)
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    },
    handleAddCancel() {
      this.additionForm = {
        name: '',
        code: '',
        permission: ''
      }
      this.$refs['additionForm'].clearValidate()
      this.dialogConfig.currentStatus = ''
      this.currentIndex = -1
      this.dialogConfig.dialogFormVisible = false
    },
    handleAddConfirm() {
      this.$refs['additionForm'].validate((valid) => {
        if (valid) {
          this.additionForm.status = 1
          addRole(this.additionForm).then(res => {
            console.log('role.vue mounted addRole success', res)
            this.refreshView()
            this.handleAddCancel()
            Message({
              message: res.message,
              type: 'success',
              duration: 5 * 1000
            })
          }).catch(err => {
            console.log('role.vue mounted addRole failure', err)
            Message({
              message: '操作失败',
              type: 'warning',
              duration: 5 * 1000
            })
          })
          return true
        } else {
          return false
        }
      })
    },
    handleAddtionClick() {
      this.additionForm = {
        name: '',
        code: '',
        permission: ''
      }
      this.dialogConfig.currentStatus = 'add'
      this.dialogConfig.dialogFormVisible = true
    },
    onSearch() {
      console.log('role.vue methods onSearch')
      const dataTemp = {
        name: this.conditionForm.name,
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchRoleList(dataTemp).then(res => {
        console.log('role.vue handleSizeChange fetchRoleList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('role.vue handleSizeChange fetchRoleList failure', err)
      })
    },
    handleEdit(index, row) {
      console.log('role.vue methods handleEdit', index, row)
      this.additionForm = {
        id: row.id,
        name: row.name,
        code: row.code
      }
      this.dialogConfig.currentStatus = 'edit'
      this.currentIndex = index
      this.dialogConfig.dialogFormVisible = true
    },
    handleSizeChange(val) {
      console.log('role.vue methods handleSizeChange', val, this.pageIndex)
      this.pageSize = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchRoleList(dataTemp).then(res => {
        console.log('role.vue handleSizeChange fetchRoleList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('role.vue handleSizeChange fetchRoleList failure', err)
      })
    },
    handleCurrentChange(val) {
      console.log('role.vue methods handleCurrentChange', val)
      this.pageIndex = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchRoleList(dataTemp).then(res => {
        console.log('role.vue handleSizeChange fetchRoleList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('role.vue handleSizeChange fetchRoleList failure', err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.role-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .header{
    background-color: #ffffff;
    padding-top: 22px;
    padding-left: 22px;
    .other-container{
      display: flex;
      .el-form-item:not(:first-child){
        margin-left: 40px;
      }
      .el-form-item:last-child{
        margin-left: 0;
      }
    }
  }
  .content{
    background-color: #ffffff;
    margin-top: 10px;
    padding: 16px;
    .pagination-cocntainer{
      text-align: right;
      margin-top: 16px;
      & > div{
        padding: 0;
      }
    }
  }
  .el-checkbox{
    font-weight: 400;
  }
}
</style>

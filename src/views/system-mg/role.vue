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
            <el-button slot="reference" size="mini" @click="handleResetPassword(scope.$index, scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="confirmDialog.dialogFormVisible"
      width="25%"
      center
    >
      <div style="text-align: center">确定要{{ tableData[currentIndex] && tableData[currentIndex].status ? '停用' : '启用' }}{{ tableData[currentIndex] && tableData[currentIndex].name }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBlockUpCancel">取 消</el-button>
        <el-button type="primary" @click="handleBlockUp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { fetchRoleList, addRole, roleToggleStatus } from '@/api/system-mg'
export default {
  name: 'Role',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      additionForm: {
        name: '',
        note: '',
        invoice_title: '',
        tax_no: '',
        user: {
          name: '',
          username: '',
          telephone: '',
          password: ''
        }
      },
      additionFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
        note: [{ required: true, message: '请输入角色编号', trigger: ['blur'] }],
        invoice_title: [{ required: true, message: '请输入发票抬头', trigger: ['blur'] }],
        tax_no: [{ required: true, message: '请输入税号', trigger: ['blur'] }],
        user: {
          name: [{ required: true, message: '请输入管理员姓名', trigger: ['blur'] }],
          username: [{ required: true, message: '请输入管理员账号', trigger: ['blur'] }],
          telephone: [{ required: true, message: '请输入管理员手机号', trigger: ['blur'] }],
          password: [{ required: true, message: '请输入密码', trigger: ['blur'] }]
        }
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
    handleBlockUpCancel() {
      this.currentIndex = -1
      this.confirmDialog.dialogFormVisible = false
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
        note: '',
        invoice_title: '',
        tax_no: '',
        user: {
          name: '',
          username: '',
          telephone: '',
          password: ''
        }
      }
      this.$refs['additionForm'].clearValidate()
      this.dialogConfig.currentStatus = ''
      this.currentIndex = -1
      this.dialogConfig.dialogFormVisible = false
    },
    handleAddConfirm() {
      this.$refs['additionForm'].validate((valid) => {
        if (valid) {
          addRole(this.additionForm).then(res => {
            console.log('role.vue mounted addRole success', res)
            if (this.dialogConfig.currentStatus === 'edit') {
              this.tableData.splice(this.currentIndex, 1, Object.assign({}, this.tableData[this.currentIndex], this.additionForm))
            } else {
              this.refreshView()
            }
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
        note: '',
        invoice_title: '',
        tax_no: '',
        user: {
          name: '',
          username: '',
          telephone: '',
          password: ''
        }
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
        note: row.note,
        invoice_title: row.invoice_title,
        tax_no: row.tax_no,
        user: row.user ? {
          name: row.user.name,
          username: row.user.username,
          telephone: row.user.telephone
        } : {}
      }
      this.dialogConfig.currentStatus = 'edit'
      this.currentIndex = index
      this.dialogConfig.dialogFormVisible = true
    },
    handleBlockUp() {
      console.log('role.vue methods handleBlockUp')
      const dataTemp = {
        id: this.tableData[this.currentIndex].id,
        status: this.tableData[this.currentIndex].status
      }
      roleToggleStatus(dataTemp).then(res => {
        console.log('role.vue handleBlockUp roleToggleStatus success', res)
        this.tableData[this.currentIndex].status = dataTemp.status
        this.handleBlockUpCancel()
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
}
</style>

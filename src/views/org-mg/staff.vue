<template>
  <div class="staff-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="姓名">
            <el-input v-model="conditionForm.name" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增人员</el-button></div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="code" label="员工编号" align="center" />
        <el-table-column prop="username" label="系统账号" align="center" />
        <el-table-column prop="department_name" label="所在部门" align="center" />
        <el-table-column prop="is_admin" label="是否管理员" align="center">
          <template slot-scope="scope"><div>{{ scope.row.is_admin ? '是' : '否' }}</div></template>
        </el-table-column>
        <el-table-column prop="telephone" label="联系电话" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ scope.row.status ? '已启用' : '已停用' }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleStatusChange(scope.$index, scope.row)">{{ scope.row.status ? '停用' : '启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增人员' : '编辑人员'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="additionForm" :rules="additionFormRules">
        <div style="padding-right: 40px;">
          <el-form-item label="姓名" label-width="100px" prop="name">
            <el-input v-model="additionForm.name" placeholder="请输入员工姓名" />
          </el-form-item>
          <el-form-item label="员工编号" label-width="100px" prop="code">
            <el-input v-model="additionForm.code" placeholder="请输入员工编号" />
          </el-form-item>
          <el-form-item label="所属部门" label-width="100px" prop="department_id">
            <el-select v-model="additionForm.department_id" placeholder="请选择所属部门" style="width: 100%;" @change="handleSelectChange">
              <el-option v-for="(item, index) in departmentList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px" prop="telephone">
            <el-input v-model="additionForm.telephone" placeholder="请输入员工手机号" />
          </el-form-item>
        </div>
        <el-divider />
        <div style="padding-right: 40px;">
          <el-form-item label="系统账号" label-width="100px" prop="username">
            <el-input v-model="additionForm.username" :disabled="!dialogConfig.accountEditable" placeholder="请输入系统账号" />
          </el-form-item>
          <el-form-item label="" label-width="100px">
            <el-alert
              type="info"
              show-icon
              :closable="false"
            >
              <div slot="title">提示：员工的登录密码默认为123456，请提示员工拿到账号立即修改密码！</div>
            </el-alert>
          </el-form-item>
        </div>
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
        <el-button @click="handleBlockUpCancel">取 消</el-button>
        <el-button type="primary" @click="handleBlockUp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchStaffList, addStaff, fetchDepartmentList, getStaffById, judge } from '@/api/org-mg'
import { Message } from 'element-ui'
export default {
  name: 'Staff',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      departmentList: [],
      additionForm: {
        status: '1',
        department_id: '',
        name: '',
        code: '',
        telephone: '',
        username: ''
      },
      additionFormRules: {
        department_id: [{ required: true, message: '请选择所属部门', trigger: ['blur'] }],
        name: [{ required: true, message: '请输入员工姓名', trigger: ['blur'] }],
        code: [{ required: true, message: '请输入员工编号', trigger: ['blur'] }],
        telephone: [{ required: true, message: '请输入员工手机号', trigger: ['blur'] }],
        username: [{ required: true, trigger: ['blur'], validator: (rule, value, callback) => {
          if (this.dialogConfig.accountEditable && !value) {
            callback('请输入系统账号')
            return
          }
          if (this.dialogConfig.accountEditable && value) {
            judge({ username: value }).then(res => {
              if (res.code === 1) {
                callback('账号已存在')
                return
              }
            }, err => {
              console.log('judge', err)
            })
          }
          callback()
        } }]
      },
      dialogConfig: {
        dialogFormVisible: false,
        currentStatus: '', // 当前的状态，编辑（edit）或者是新增（add）
        accountEditable: true // 账号是否可编辑
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
    fetchStaffList(dataTemp).then(res => {
      console.log('staff.vue mounted fetchStaffList success', res)
      this.tableData.push(...res.data.data)
      this.total = res.data.total
    }).catch(err => {
      console.log('staff.vue mounted fetchStaffList failure', err)
    })
  },
  methods: {
    handleBlockUpCancel() {
      console.log('enterprise.vue methods handleBlockUpCancel')
      this.currentIndex = -1
      this.confirmDialog.dialogFormVisible = false
    },
    handleStatusChange(index, row) {
      console.log('enterprise.vue methods handleStatusChange', index, row)
      this.currentIndex = index
      this.confirmDialog.dialogFormVisible = true
    },
    handleSelectChange(val) {
      console.log('staff.vue methods handleSelectChange', val)
    },
    handleRadioGroupChange(val) {
      console.log('staff.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchStaffList(dataTemp).then(res => {
        console.log('staff.vue mounted fetchStaffList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('staff.vue mounted fetchStaffList failure', err)
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
        status: '1',
        department_id: '',
        name: '',
        code: '',
        telephone: '',
        username: ''
      }
      this.$refs['additionForm'].clearValidate()
      this.dialogConfig.currentStatus = ''
      this.currentIndex = -1
      this.dialogConfig.dialogFormVisible = false
    },
    handleAddConfirm() {
      this.$refs['additionForm'].validate((valid) => {
        if (valid) {
          const result = Object.assign({}, this.additionForm)
          if (this.dialogConfig.currentStatus === 'edit') {
            result.department_name = this.departmentList.find(item => item.id === this.additionForm.department_id).name
            if (!this.dialogConfig.accountEditable) {
              delete result.username
            } else if (result.username) {
              result.password = '123456'
            }
          } else {
            if (result.username) {
              result.password = '123456'
            }
          }
          addStaff(result).then(res => {
            console.log('staff.vue mounted addStaff success', res)
            this.dialogConfig.accountEditable = true
            if (this.dialogConfig.currentStatus === 'edit') {
              this.tableData.splice(this.currentIndex, 1, Object.assign({}, this.tableData[this.currentIndex], result))
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
            console.log('staff.vue mounted addStaff failure', err)
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
        status: '1',
        department_id: '',
        name: '',
        code: '',
        telephone: '',
        username: ''
      }
      this.dialogConfig.dialogFormVisible = true
      this.dialogConfig.currentStatus = 'add'
      this.dialogConfig.accountEditable = true
      const dataTemp = {
        pageIndex: 1,
        pageSize: 1000
      }
      fetchDepartmentList(dataTemp).then(res => {
        console.log('staff.vue mounted fetchDepartmentList success', res)
        this.departmentList.length = 0
        this.departmentList.push(...res.data.data)
      }).catch(err => {
        console.log('staff.vue mounted fetchDepartmentList failure', err)
      })
    },
    onSearch() {
      console.log('staff.vue methods onSearch')
      const dataTemp = {
        name: this.conditionForm.name,
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchStaffList(dataTemp).then(res => {
        console.log('staff.vue mounted fetchStaffList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('staff.vue mounted fetchStaffList failure', err)
      })
    },
    handleEdit(index, row) {
      console.log('staff.vue methods handleEdit', index, row)
      getStaffById({ id: row.id }).then(res => {
        console.log('staff.vue handleEdit getStaffById success', res)
        if (!res.data.username) {
          this.dialogConfig.accountEditable = true
        } else {
          this.dialogConfig.accountEditable = false
        }
        this.additionForm = {
          id: res.data.id,
          department_id: res.data.department_id,
          name: res.data.name,
          code: res.data.code,
          telephone: res.data.telephone,
          username: res.data.username
        }
      }).catch(err => {
        console.log('staff.vue handleEdit getStaffById failure', err)
      })
      this.dialogConfig.currentStatus = 'edit'
      this.currentIndex = index
      this.dialogConfig.dialogFormVisible = true
      const dataTemp = {
        pageIndex: 1,
        pageSize: 1000
      }
      fetchDepartmentList(dataTemp).then(res => {
        console.log('staff.vue handleEdit fetchDepartmentList success', res)
        this.departmentList.length = 0
        this.departmentList.push(...res.data.data)
      }).catch(err => {
        console.log('staff.vue mounted fetchDepartmentList failure', err)
      })
    },
    handleBlockUp(index, row) {
      console.log('staff.vue methods handleBlockUp')
      const dataTemp = {
        id: this.tableData[this.currentIndex].id,
        status: this.tableData[this.currentIndex].status === 0 ? 1 : 0
      }
      addStaff(dataTemp).then(res => {
        console.log('staff.vue handleBlockUp addStaff success', res)
        this.tableData[this.currentIndex].status = dataTemp.status
        this.handleBlockUpCancel()
        Message({
          message: res.message,
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(err => {
        console.log('staff.vue handleBlockUp addStaff failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    handleSizeChange(val) {
      console.log('staff.vue methods handleSizeChange', val, this.pageIndex)
      this.pageSize = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchStaffList(dataTemp).then(res => {
        console.log('staff.vue mounted fetchStaffList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('staff.vue mounted fetchStaffList failure', err)
      })
    },
    handleCurrentChange(val) {
      console.log('staff.vue methods handleCurrentChange', val)
      this.pageIndex = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchStaffList(dataTemp).then(res => {
        console.log('staff.vue mounted fetchStaffList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('staff.vue mounted fetchStaffList failure', err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.staff-container{
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

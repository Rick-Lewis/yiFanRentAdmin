<template>
  <div class="enterprise-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="单位状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="单位名称">
            <el-input v-model="conditionForm.name" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增单位</el-button></div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="单位名称" align="center" />
        <el-table-column prop="note" label="单位编号" align="center" />
        <el-table-column prop="user.name" label="管理员" align="center" />
        <el-table-column prop="user.username" label="管理员账号" align="center" />
        <el-table-column prop="user.telephone" label="联系方式" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ scope.row.status ? '已启用' : '已停用' }}</div></template>
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
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增企业' : '编辑企业'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="additionForm" :rules="additionFormRules" style="padding-right: 40px;">
        <el-form-item label="类型" label-width="120px" prop="type">
          <el-select v-model="additionForm.type" placeholder="请选择类型" style="width: 100%;" @change="handleSelectChange">
            <el-option v-for="(item, index) in dialogConfig.typeOptions" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="additionForm.type === 0" label="机构" label-width="120px" prop="parent">
          <el-select v-model="additionForm.parent" placeholder="请选择所属机构" style="width: 100%;">
            <el-option v-for="(item, index) in dialogConfig.orgList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" label-width="120px" prop="name">
          <el-input v-model="additionForm.name" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="单位编号" label-width="120px" prop="note">
          <el-input v-model="additionForm.note" placeholder="请输入单位编号" />
        </el-form-item>
        <el-form-item label="管理员" label-width="120px" prop="user.name">
          <el-input v-model="additionForm.user.name" placeholder="请输入管理员姓名" />
        </el-form-item>
        <el-form-item label="管理员账号" label-width="120px" prop="user.username">
          <el-input v-model="additionForm.user.username" placeholder="请输入管理员账号" />
        </el-form-item>
        <el-form-item v-if="dialogConfig.currentStatus === 'add' ? true : false" label="密码" label-width="120px" prop="user.password">
          <el-input v-model="additionForm.user.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="管理员联系方式" label-width="120px" prop="user.telephone">
          <el-input v-model="additionForm.user.telephone" placeholder="请输入管理员手机号" />
        </el-form-item>
        <el-form-item label="发票抬头" label-width="120px" prop="invoice_title">
          <el-input v-model="additionForm.invoice_title" placeholder="请输入发票抬头" />
        </el-form-item>
        <el-form-item label="税号" label-width="120px" prop="tax_no">
          <el-input v-model="additionForm.tax_no" placeholder="请输入税号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="resetDialog.dialogFormVisible"
      width="30%"
      center
    >
      <el-form ref="resetForm" :model="resetForm" style="padding-right: 40px;">
        <el-form-item label="新密码" label-width="110px">
          <el-input v-model="resetForm.password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" label-width="110px">
          <el-input v-model="resetForm.confirmPassword" placeholder="请输入确认新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordCancel">取 消</el-button>
        <el-button type="primary" @click="resetPasswordConfirm">确 定</el-button>
      </span>
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
import { Message } from 'element-ui'
import { fetchEnterpriseList, addEnterprise, reset } from '@/api/org-mg'
export default {
  name: 'Enterprise',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      resetForm: {
        password: '',
        confirmPassword: ''
      },
      resetDialog: {
        dialogFormVisible: false
      },
      additionForm: {
        type: 0,
        parent: '',
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
        type: [{ required: true, message: '请选择类型', trigger: ['blur'] }],
        parent: [{ required: true, message: '请选择所属机构', trigger: ['blur'] }],
        name: [{ required: true, message: '请输入单位名称', trigger: ['blur'] }],
        note: [{ required: true, message: '请输入单位编号', trigger: ['blur'] }],
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
        currentStatus: '', // 当前的状态，编辑（edit）或者是新增（add
        typeOptions: [{
          id: 0,
          name: '企业'
        }, {
          id: 1,
          name: '机构'
        }],
        orgList: []
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
    fetchEnterpriseList(dataTemp).then(res => {
      console.log('enterprise.vue mounted fetchEnterpriseList success', res)
      this.tableData.push(...res.data.data)
      this.total = res.data.total
    }).catch(err => {
      console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
    })
  },
  methods: {
    handleSelectChange(val) {
      console.log('enterprise.vue methods handleSelectChange', val)
      this.additionForm.type = parseInt(val)
      if (val === 0) {
        const dataTemp = {
          pageIndex: 0,
          pageSize: 1000
        }
        fetchEnterpriseList(dataTemp).then(res => {
          console.log('enterprise.vue mounted fetchEnterpriseList success', res)
          this.dialogConfig.orgList.length === 0
          this.dialogConfig.orgList.push(...res.data.data)
        }).catch(err => {
          console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
        })
      }
    },
    handleBlockUpCancel() {
      this.currentIndex = -1
      this.confirmDialog.dialogFormVisible = false
    },
    handleStatusChange(index, row) {
      console.log('enterprise.vue methods handleStatusChange', index, row)
      this.currentIndex = index
      this.confirmDialog.dialogFormVisible = true
    },
    handleResetPassword(index, row) {
      console.log('enterprise.vue methods handleResetPassword', index, row)
      this.currentIndex = index
      this.resetDialog.dialogFormVisible = true
    },
    resetPasswordCancel() {
      this.currentIndex = -1
      this.resetDialog.dialogFormVisible = false
    },
    resetPasswordConfirm() {
      console.log('enterprise.vue methods resetPasswordConfirm')
      if (!this.resetForm.password || !this.resetForm.confirmPassword) {
        Message({
          message: '请按要求完善信息',
          type: 'warning',
          duration: 5 * 1000
        })
        return
      } else if (this.resetForm.password !== this.resetForm.confirmPassword) {
        Message({
          message: '两次密码输入不一致',
          type: 'warning',
          duration: 5 * 1000
        })
        return
      }
      const dataTemp = {
        id: this.tableData[this.currentIndex].id,
        password: this.resetForm.password
      }
      reset(dataTemp).then(res => {
        console.log('enterprise.vue methods handleResetPassword reset success', res)
        this.resetPasswordCancel()
        Message({
          message: res.message,
          type: 'success',
          duration: 5 * 1000
        })
      }, err => {
        console.log('enterprise.vue methods handleResetPassword reset success', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    handleRadioGroupChange(val) {
      console.log('enterprise.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchEnterpriseList(dataTemp).then(res => {
        console.log('enterprise.vue mounted fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
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
          addEnterprise(this.additionForm).then(res => {
            console.log('enterprise.vue mounted addEnterprise success', res)
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
            console.log('enterprise.vue mounted addEnterprise failure', err)
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
        type: 0,
        parent: '',
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
      const dataTemp = {
        pageIndex: 0,
        pageSize: 1000
      }
      fetchEnterpriseList(dataTemp).then(res => {
        console.log('enterprise.vue mounted fetchEnterpriseList success', res)
        this.dialogConfig.orgList.length === 0
        this.dialogConfig.orgList.push(...res.data.data)
      }).catch(err => {
        console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
      })
    },
    onSearch() {
      console.log('enterprise.vue methods onSearch')
      const dataTemp = {
        name: this.conditionForm.name,
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchEnterpriseList(dataTemp).then(res => {
        console.log('enterprise.vue handleSizeChange fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('enterprise.vue handleSizeChange fetchEnterpriseList failure', err)
      })
    },
    handleEdit(index, row) {
      console.log('enterprise.vue methods handleEdit', index, row)
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
      console.log('enterprise.vue methods handleBlockUp')
      const dataTemp = {
        id: this.tableData[this.currentIndex].id,
        status: this.tableData[this.currentIndex].status === 0 ? 1 : 0
      }
      addEnterprise(dataTemp).then(res => {
        console.log('enterprise.vue handleBlockUp addEnterprise success', res)
        this.tableData[this.currentIndex].status = dataTemp.status
        this.handleBlockUpCancel()
        Message({
          message: res.message,
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(err => {
        console.log('enterprise.vue handleBlockUp addEnterprise failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    handleSizeChange(val) {
      console.log('enterprise.vue methods handleSizeChange', val, this.pageIndex)
      this.pageSize = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchEnterpriseList(dataTemp).then(res => {
        console.log('enterprise.vue handleSizeChange fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('enterprise.vue handleSizeChange fetchEnterpriseList failure', err)
      })
    },
    handleCurrentChange(val) {
      console.log('enterprise.vue methods handleCurrentChange', val)
      this.pageIndex = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchEnterpriseList(dataTemp).then(res => {
        console.log('enterprise.vue handleSizeChange fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('enterprise.vue handleSizeChange fetchEnterpriseList failure', err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.enterprise-container{
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

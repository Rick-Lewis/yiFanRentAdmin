<template>
  <div class="department-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="部门状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="部门名称">
            <el-input v-model="conditionForm.name" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增部门</el-button></div>
    <div class="content">
      <el-table
        :data="tableData"
        row-key="id"
        :tree-props="{children: 'children'}"
        border
      >
        <el-table-column prop="name" label="部门" align="center" min-width="100px" />
        <el-table-column prop="enterprise_name" label="所属企业" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ scope.row.status ? '已启用' : '已停用' }}</div></template>
        </el-table-column>
        <el-table-column prop="time_create" label="添加时间" align="center">
          <template slot-scope="scope"><div>{{ $moment(scope.row.time_create).format("YYYY-DD-MM") }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleStatusChange(scope.row)">{{ scope.row.status ? '停用' : '启用' }}</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增部门' : '编辑部门'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="additionForm" :rules="additionFormRules" style="padding-right: 40px;">
        <el-form-item label="上级部门" label-width="100px">
          <el-cascader
            v-model="additionForm.parent"
            :options="tableData"
            :props="{ checkStrictly: true, label: 'name', value: 'id'}"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门名称" label-width="100px" prop="name">
          <el-input v-model="additionForm.name" placeholder="请输入部门的名称" />
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
      <div style="text-align: center">确定要{{ currentItem && currentItem.status ? '停用' : '启用' }}{{ currentItem && currentItem.name }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBlockUpCancel">取 消</el-button>
        <el-button type="primary" @click="handleBlockUp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchDepartmentList, addDepartment } from '@/api/org-mg'
import { Message } from 'element-ui'
export default {
  name: 'Department',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      additionForm: {
        parent: [],
        name: ''
      },
      additionFormRules: {
        name: [{ required: true, message: '请输入部门的名称', trigger: ['blur'] }]
      },
      dialogConfig: {
        dialogFormVisible: false,
        currentStatus: '' // 当前的状态，编辑（edit）或者是新增（add）
      },
      currentItem: null, // 记录当前状态下操作的目标数据
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
      pageSize: 1000
    }
  },
  computed: {},
  created() {},
  mounted() {
    const dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchDepartmentList(dataTemp).then(res => {
      console.log('enterprise.vue mounted fetchDepartmentList success', res)
      this.handleDepartmentList(res.data.data, res.data.data)
      this.tableData.push(...res.data.data)
    }).catch(err => {
      console.log('enterprise.vue mounted fetchDepartmentList failure', err)
    })
  },
  methods: {
    handleBlockUpCancel() {
      this.currentItem = null
      this.confirmDialog.dialogFormVisible = false
    },
    handleStatusChange(row) {
      console.log('enterprise.vue methods handleStatusChange', row)
      this.currentItem = row
      this.confirmDialog.dialogFormVisible = true
    },
    handleBlockUp() {
      console.log('enterprise.vue methods handleBlockUp')
      const tempData = {
        id: this.currentItem.id,
        status: this.currentItem.status === 0 ? 1 : 0
      }
      addDepartment(tempData).then(res => {
        console.log('enterprise.vue mounted addDepartment success', res)
        this.handleBlockUpCancel()
        if (res.code === 0) {
          this.refreshView()
          Message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: res.message,
            type: 'warning',
            duration: 5 * 1000
          })
        }
      }).catch(err => {
        console.log('enterprise.vue mounted addDepartment failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    handleEdit(row) {
      console.log('enterprise.vue methods handleEdit', row)
      this.additionForm = {
        id: row.id,
        name: row.label,
        parent: [row.parent, row.id]
      }
      this.dialogConfig.currentStatus = 'edit'
      this.dialogConfig.currentItem = row
      this.dialogConfig.dialogFormVisible = true
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
    handleDepartmentList(target, data) {
      if (target && target.length > 0) {
        for (let i = 0; i < target.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].parent === target[i].id) { // 找到目标元素的children
              if (!target[i].children) {
                target[i].children = []
              }
              target[i].children.push(data[j])
              data.splice(j, 1)
              j--
            }
          }
          this.handleDepartmentList(target[i].children, data)
        }
        return data
      } else {
        return []
      }
    },
    handleRadioGroupChange(val) {
      console.log('enterprise.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchDepartmentList(dataTemp).then(res => {
        console.log('enterprise.vue mounted fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.handleDepartmentList(res.data.data, res.data.data)
        this.tableData.push(...res.data.data)
      }).catch(err => {
        console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
      })
    },
    handleAddCancel() {
      this.additionForm = {
        name: '',
        parent: []
      }
      this.$refs['additionForm'].clearValidate()
      this.dialogConfig.currentStatus = ''
      this.currentItem = null
      this.dialogConfig.dialogFormVisible = false
    },
    handleAddConfirm() {
      this.$refs['additionForm'].validate((valid) => {
        if (valid) {
          const temp = {
            status: '1',
            parent: this.additionForm.parent[this.additionForm.parent.length - 1],
            name: this.additionForm.name
          }
          addDepartment(temp).then(res => {
            console.log('enterprise.vue mounted addDepartment success', res)
            if (res.code === 0) {
              this.refreshView()
              this.handleAddCancel()
              Message({
                message: res.message,
                type: 'success',
                duration: 5 * 1000
              })
            } else {
              Message({
                message: res.message,
                type: 'warning',
                duration: 5 * 1000
              })
            }
          }).catch(err => {
            console.log('enterprise.vue mounted addDepartment failure', err)
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
        parent: [],
        name: ''
      }
      this.dialogConfig.currentStatus = 'add'
      this.dialogConfig.dialogFormVisible = true
    },
    onSubmit() {
      console.log('department.vue methods onSubmit')
      const dataTemp = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      if (this.conditionForm.status !== '-1') {
        dataTemp.status = this.conditionForm.status
      }
      if (this.conditionForm.name) {
        dataTemp.name = this.conditionForm.name
      }
      fetchDepartmentList(dataTemp).then(res => {
        console.log('enterprise.vue onSubmit fetchDepartmentList success', res)
        if (res.code === 0) {
          this.handleDepartmentList(res.data.data, res.data.data)
          this.tableData.length = 0
          this.tableData.push(...res.data.data)
        } else {
          Message({
            message: res.message,
            type: 'warning',
            duration: 5 * 1000
          })
        }
      }).catch(err => {
        console.log('enterprise.vue onSubmit fetchDepartmentList failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.department-container{
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
    .tree-header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #909399;
      font-size: 14px;
      padding: 10px 27px 10px 46px;
      background-color: #f9f9f9;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
}
</style>

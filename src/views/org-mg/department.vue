<template>
  <div class="department-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="部门名称">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增部门</el-button></div>
    <div class="content">
      <div class="tree-header">
        <div>部门树</div>
        <div>状态</div>
        <div>操作</div>
      </div>
      <el-tree :data="tableData" show-checkbox node-key="id" :expand-on-click-node="false" style="margin-top: 5px;">
        <span slot-scope="{ node }" class="custom-tree-node">
          <span style="flex: 1">{{ node.data.label }}</span>
          <span style="flex: 1; text-align: center;">{{ node.data.status ? '已启用' : '已停用' }}</span>
          <span style="flex: 1; text-align: right;">
            <el-button type="text" size="mini" @click="() => handleEdit(node.data)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="() => handleStatusChange(node.data)">
              {{ node.data.status ? '停用' : '启用' }}
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增部门' : '编辑部门'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="addtionForm" :rules="additionFormRules" style="padding-right: 40px;">
        <el-form-item label="上级部门" label-width="100px">
          <el-select v-model="addtionForm.parent" placeholder="请选择" style="width: 100%;">
            <el-option v-for="(item, index) in departList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" label-width="100px" prop="name">
          <el-input v-model="addtionForm.name" placeholder="请输入部门的名称" />
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
let id = 1000
export default {
  name: 'Department',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      addtionForm: {
        parent: '',
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
      departList: [],
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
      const temp = this.handleDepartmentList(res.data.data)
      this.departList.push(...res.data.data)
      this.tableData.push(...temp)
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
      this.addtionForm = {
        id: row.id,
        name: row.name
      }
      if (row.parent !== 0) {
        this.addtionForm.parent = row.parent
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
    handleDepartmentList(data) {
      if (data && data.length > 0) {
        const result = []
        for (let i = 0; i < data.length; i++) {
          const temp = {
            id: data[i].id,
            label: data[i].name,
            parent: data[i].parent === undefined ? 0 : data[i].parent,
            status: data[i].status
          }
          if (data[i].level === undefined) {
            if (!result[0]) {
              result[0] = []
            }
            result[0].push(temp)
          } else {
            if (!result[data[i].level]) {
              result[data[i].level] = []
            }
            result[data[i].level].push(temp)
          }
        }
        return this.toTree(result)
      } else {
        return []
      }
    },
    toTree(result) {
      while (result.length > 1) {
        const yList = result.pop()
        const temp = result[result.length - 1]
        for (let i = 0; i < yList.length; i++) {
          for (let j = 0; j < temp.length; j++) {
            if (temp[j].id === yList[i].parent) { // yList[i]的父节点是temp[j]
              if (!temp[j].children) {
                temp[j].children = []
              }
              temp[j].children.push(yList[i])
              break
            }
          }
        }
      }
      return result[0]
    },
    handleRadioGroupChange(val) {
      console.log('enterprise.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchDepartmentList(dataTemp).then(res => {
        console.log('enterprise.vue mounted fetchEnterpriseList success', res)
        this.tableData.length = 0
        // this.tableData.push(...res.data.data)
      }).catch(err => {
        console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
      })
    },
    handleAddCancel() {
      this.addtionForm = {
        name: '',
        parent: ''
      }
      this.$refs['additionForm'].clearValidate()
      this.dialogConfig.currentStatus = ''
      this.currentItem = null
      this.dialogConfig.dialogFormVisible = false
    },
    handleAddConfirm() {
      this.$refs['additionForm'].validate((valid) => {
        if (valid) {
          this.addtionForm.status = '1'
          addDepartment(this.addtionForm).then(res => {
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
      this.dialogConfig.currentStatus = 'add'
      this.dialogConfig.dialogFormVisible = true
    },
    onSubmit() {
      console.log('department.vue methods onSubmit')
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
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

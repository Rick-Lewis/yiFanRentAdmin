<template>
  <div class="function-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="菜单状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="菜单名称">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增</el-button></div>
    <div class="content">
      <el-table
        :data="tableData"
        row-key="id"
        :tree-props="{children: 'children'}"
        border
      >
        <el-table-column prop="name" label="功能名称" align="center" min-width="100px" />
        <el-table-column prop="code" label="唯一标识" align="center" />
        <el-table-column prop="sort" label="排序号" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ scope.row.status ? '已启用' : '已停用' }}</div></template>
        </el-table-column>
        <el-table-column prop="time_create" label="创建时间" align="center">
          <template slot-scope="scope"><div>{{ $moment(scope.row.time_create).format("YYYY-DD-MM") }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增功能' : '编辑功能'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="addtionForm" :rules="additionFormRules" style="padding-right: 40px;">
        <el-form-item label="功能名称" label-width="100px" prop="name">
          <el-input v-model="addtionForm.name" placeholder="请输入部门的名称" />
        </el-form-item>
        <el-form-item label="唯一标识" label-width="100px" prop="code">
          <el-input v-model="addtionForm.code" placeholder="请输入唯一标识" />
        </el-form-item>
        <el-form-item label="排序号" label-width="100px" prop="sort">
          <el-input v-model="addtionForm.sort" placeholder="请输入排序号" />
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
      <div style="text-align: center">确定要删除{{ currentItem && currentItem.name }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleBlockUpCancel">取 消</el-button>
        <el-button type="primary" @click="handleBlockUp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchFunctionList, addFunction, functionToggleStatus } from '@/api/system-mg'
import { Message } from 'element-ui'
let id = 1000
export default {
  name: 'Function',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      addtionForm: {
        name: '',
        code: '',
        sort: ''
      },
      additionFormRules: {
        name: [{ required: true, message: '请输入功能名称', trigger: ['blur'] }],
        code: [{ required: true, message: '请输入功能唯一标识', trigger: ['blur'] }],
        sort: [{ required: true, message: '请输入功能排序号', trigger: ['blur'] }]
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
  created() {
    const dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchFunctionList(dataTemp).then(res => {
      console.log('function.vue mounted fetchFunctionList success', res)
      this.tableData.push(...res.data.data)
    }).catch(err => {
      console.log('function.vue mounted fetchFunctionList failure', err)
    })
  },
  mounted() {},
  methods: {
    handleBlockUpCancel() {
      this.currentItem = null
      this.confirmDialog.dialogFormVisible = false
    },
    handleDelete(row) {
      console.log('function.vue methods handleDelete', row)
      this.currentItem = row
      this.confirmDialog.dialogFormVisible = true
    },
    handleBlockUp() {
      console.log('function.vue methods handleBlockUp')
      const tempData = {
        id: this.currentItem.id,
        status: this.currentItem.status
      }
      functionToggleStatus(tempData).then(res => {
        console.log('function.vue mounted toggleStatus success', res)
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
        console.log('function.vue mounted toggleStatus failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    handleEdit(row) {
      console.log('function.vue methods handleEdit', row)
      this.addtionForm = {
        id: row.id,
        name: row.name,
        code: row.code,
        sort: row.sort
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
    handleRadioGroupChange(val) {
      console.log('function.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchFunctionList(dataTemp).then(res => {
        console.log('function.vue mounted fetchEnterpriseList success', res)
        this.tableData.length = 0
        // this.tableData.push(...res.data.data)
      }).catch(err => {
        console.log('function.vue mounted fetchEnterpriseList failure', err)
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
          addFunction(this.addtionForm).then(res => {
            console.log('function.vue mounted addFunction success', res)
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
            console.log('function.vue mounted addFunction failure', err)
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
      this.addtionForm = {
        parent: '',
        name: ''
      }
      this.dialogConfig.currentStatus = 'add'
      this.dialogConfig.dialogFormVisible = true
    },
    onSubmit() {
      console.log('function.vue methods onSubmit')
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
.function-container{
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

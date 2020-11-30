<template>
  <div class="menu-container">
    <div class="content">
      <el-steps direction="vertical">
        <el-step title="开始" status="finish" style="height: 100px;" />
        <el-step v-for="(item, index) in tableData" :key="item.id" status="finish" style="height: 100px;" @click="handleEdit(item)">
          <div slot="title"><span @click="handleEdit(index, item)">{{ item.name }}</span><i class="el-icon-delete" style="color: red; margin-left: 8px;" @click="handleDelete(index, item)" /></div>
          <div slot="description" @click="handleEdit(index, item)">{{ item.checker }}</div>
        </el-step>
        <el-step title="结束" status="process" style="height: 100px;" />
      </el-steps>
      <div>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>
    <el-dialog :title="dialogConfig.currentStatus === 'add' ? '新增节点' : '编辑节点'" :visible.sync="dialogConfig.dialogFormVisible" width="30%">
      <el-form ref="additionForm" :model="additionForm" :rules="additionFormRules" style="padding-right: 40px;">
        <el-form-item label="节点名称" label-width="100px" prop="name">
          <el-input v-model="additionForm.name" placeholder="请输入节点的名称" />
        </el-form-item>
        <el-form-item label="步骤序号" label-width="100px" prop="index">
          <el-input v-model="additionForm.index" placeholder="请输入节点的审核步骤序号" />
        </el-form-item>
        <el-form-item label="审核人" label-width="100px" prop="check_user">
          <el-select v-model="additionForm.check_user" filterable remote :remote-method="handleRemoteMethod" :loading="dialogConfig.loading" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dialogConfig.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            />
          </el-select>
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
      <div style="text-align: center">确定要删除{{ tableData[currentIndex] && tableData[currentIndex].name }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => handleBlockUpCancel()">取 消</el-button>
        <el-button type="primary" @click="() => handleBlockUp()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchFlowList, addCheckNode, deleteCheckNode } from '@/api/system-mg'
import { fetchStaffList } from '@/api/org-mg'
import { Message } from 'element-ui'
export default {
  name: 'Menu',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
      },
      dialogConfig: {
        dialogFormVisible: false,
        currentStatus: '', // 当前的状态，编辑（edit）或者是新增（add）
        loading: false,
        options: []
      },
      additionForm: {
        name: '',
        index: -1,
        check_user: ''
      },
      additionFormRules: {
        name: [{ required: true, message: '请输入节点的名称', trigger: ['blur'] }],
        index: [{ required: true, message: '请输入节点的审核步骤序号', trigger: ['blur'] }],
        check_user: [{ required: true, message: '请输入节点的审核人', trigger: ['blur'] }]
      },
      currentIndex: -1, // 记录当前状态下操作的目标数据的索引
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
    fetchFlowList(dataTemp).then(res => {
      console.log('check-flow.vue mounted fetchFlowList success', res)
      this.tableData.push(...res.data.data)
    }).catch(err => {
      console.log('check-flow.vue mounted fetchFlowList failure', err)
    })
  },
  mounted() {},
  methods: {
    handleRemoteMethod(query) {
      console.log('check-flow.vue mounmethodsted handleRemoteMethod')
      this.dialogConfig.loading = true
      const dataTemp = {
        name: query,
        pageIndex: this.pageIndex,
        pageSize: 1000
      }
      fetchStaffList(dataTemp).then(res => {
        console.log('staff.vue mounted fetchStaffList success', res)
        this.dialogConfig.options.push(...res.data.data)
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
    handleBlockUpCancel(type) {
      this.currentIndex = -1
      this.confirmDialog.dialogFormVisible = false
    },
    handleBlockUp(type) {
      console.log('role.vue methods handleBlockUp', type)
      const dataTemp = {
        id: this.tableData[this.currentIndex].id
      }
      deleteCheckNode(dataTemp).then(res => {
        console.log('role.vue handleBlockUp deleteCheckNode success', res)
        this.refreshView()
        this.handleBlockUpCancel(type)
        Message({
          message: res.message,
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(err => {
        console.log('role.vue handleBlockUp deleteCheckNode failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
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
          addCheckNode(this.additionForm).then(res => {
            console.log('role.vue mounted addCheckNode success', res)
            this.refreshView()
            this.handleAddCancel()
            Message({
              message: res.message,
              type: 'success',
              duration: 5 * 1000
            })
          }).catch(err => {
            console.log('role.vue mounted addCheckNode failure', err)
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
    handleEdit(index, row) {
      console.log('check-flow.vue methods handleEdit', index, row)
      this.additionForm = {
        id: row.id,
        name: row.name,
        index: row.index,
        check_user: row.check_user
      }
      this.dialogConfig.currentStatus = 'edit'
      this.currentIndex = index
      this.dialogConfig.dialogFormVisible = true
    },
    handleAdd() {
      console.log('check-flow.vue methods handleAdd')
      this.additionForm = {
        name: '',
        index: '',
        check_user: ''
      }
      this.dialogConfig.currentStatus = 'add'
      this.dialogConfig.dialogFormVisible = true
    },
    handleDelete(index, row) {
      console.log('check-flow.vue methods handleDelete', index, row)
      this.currentIndex = index
      this.confirmDialog.dialogFormVisible = true
    }
  }
}
</script>
<style lang='scss' scoped>
.menu-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .content{
    background-color: #ffffff;
    margin-top: 10px;
    padding: 16px;
    display: flex;
    justify-content: center;
  }
}
</style>

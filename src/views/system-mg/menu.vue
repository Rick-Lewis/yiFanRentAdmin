<template>
  <div class="menu-container">
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
        <el-table-column prop="name" label="菜单名称" align="center" min-width="100px" />
        <el-table-column prop="icon" label="图标" align="center">
          <template slot-scope="scope"><div><i :class="scope.row.icon" /></div></template>
        </el-table-column>
        <el-table-column prop="url" label="菜单地址" align="center" min-width="165px" />
        <el-table-column prop="code" label="唯一标识" align="center" />
        <el-table-column prop="is_menu" label="类型" align="center">
          <template slot-scope="scope"><div>{{ scope.row.is_menu ? '菜单' : '功能' }}</div></template>
        </el-table-column>
        <el-table-column prop="note" label="排序号" align="center" />
        <el-table-column prop="functions" label="包含功能" align="center">
          <template slot-scope="scope"><div>{{ getFuncLabels(scope.row.functions) }}</div></template>
        </el-table-column>
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
import { fetchMenuList, menuToggleStatus } from '@/api/system-mg'
import { Message } from 'element-ui'
export default {
  name: 'Menu',
  components: {},
  data: function() {
    return {
      confirmDialog: {
        dialogFormVisible: false
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
    fetchMenuList(dataTemp).then(res => {
      console.log('menu.vue mounted fetchMenuList success', res)
      const temp = this._.cloneDeep(res.data.data)
      this.handleMenuList(temp, temp)
      this.tableData.push(...temp)
    }).catch(err => {
      console.log('menu.vue mounted fetchMenuList failure', err)
    })
  },
  mounted() {},
  methods: {
    getFuncLabels(data) {
      if (!data) return ''
      return JSON.parse(data).map(item => item.label).join(',')
    },
    handleBlockUpCancel() {
      this.currentItem = null
      this.confirmDialog.dialogFormVisible = false
    },
    handleStatusChange(row) {
      console.log('menu.vue methods handleStatusChange', row)
      this.currentItem = row
      this.confirmDialog.dialogFormVisible = true
    },
    handleBlockUp() {
      console.log('menu.vue methods handleBlockUp')
      const tempData = {
        id: this.currentItem.id,
        status: this.currentItem.status
      }
      menuToggleStatus(tempData).then(res => {
        console.log('menu.vue mounted menuToggleStatus success', res)
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
        console.log('menu.vue mounted menuToggleStatus failure', err)
        Message({
          message: '操作失败',
          type: 'warning',
          duration: 5 * 1000
        })
      })
    },
    handleEdit(row) {
      console.log('menu.vue methods handleEdit', row)
      this.$router.push({ path: `/system-mg/menu-addition?action=edit&id=${row.id}` })
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
    handleRadioGroupChange(val) {
      console.log('menu.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        name: this.conditionForm.name,
        status: val === '-1' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchMenuList(dataTemp).then(res => {
        console.log('menu.vue mounted fetchEnterpriseList success', res)
        this.tableData.length = 0
        // this.tableData.push(...res.data.data)
      }).catch(err => {
        console.log('menu.vue mounted fetchEnterpriseList failure', err)
      })
    },
    handleAddtionClick() {
      this.$router.push({ path: '/system-mg/menu-addition' })
    },
    onSubmit() {
      console.log('menu.vue methods onSubmit')
    }
  }
}
</script>
<style lang='scss' scoped>
.menu-container{
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

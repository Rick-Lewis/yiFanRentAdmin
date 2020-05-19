<template>
  <div class="staff-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small">
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
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAddtionClick">+新增人员</el-button></div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="number" label="员工编号" align="center" />
        <el-table-column prop="dept" label="所在部门" align="center" />
        <el-table-column prop="phone" label="联系电话" align="center" />
        <el-table-column prop="status" label="状态" align="center" />
        <el-table-column prop="action" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleBlockUp(scope.$index, scope.row)">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="12" layout="total, prev, pager, next, sizes, jumper" :total="10" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog title="新增人员" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="addtionForm" style="padding-right: 40px;">
        <el-form-item label="姓名" label-width="100px">
          <el-input v-model="addtionForm.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="员工编号" label-width="100px">
          <el-input v-model="addtionForm.number" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="所属部门" label-width="100px">
          <el-select v-model="addtionForm.preDpt" placeholder="请选择" style="width: 100%;">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" label-width="100px">
          <el-input v-model="addtionForm.telephone" placeholder="请输入员工手机号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchStaffList, addStaff } from '@/api/org-mg'
export default {
  name: 'Staff',
  components: {},
  data: function() {
    return {
      addtionForm: {
        preDpt: '',
        name: '',
        number: '',
        telephone: ''
      },
      dialogFormVisible: false,
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
        status: '0',
        name: ''
      },
      tableData: [{
        id: '',
        name: '张三丰',
        number: '0001',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '张无忌',
        number: '0002',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '郭靖',
        number: '0003',
        dept: '税务组',
        phone: '130000000000',
        status: '已启用'
      }],
      pageIndex: 1,
      pageSize: 10
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
      // this.tableData.push(...res.data.data)
    }).catch(err => {
      console.log('staff.vue mounted fetchStaffList failure', err)
    })
  },
  methods: {
    handleAddConfirm() {
      const dataTemp = {
        name: this.addtionForm.name,
        telephone: this.addtionForm.telephone
      }
      addStaff(dataTemp).then(res => {
        console.log('staff.vue mounted addStaff success', res)
      }).catch(err => {
        console.log('staff.vue mounted addStaff failure', err)
      })
    },
    handleAddtionClick() {
      this.dialogFormVisible = true
    },
    onSubmit() {
      console.log('staff.vue methods onSubmit')
    },
    handleEdit() {
      console.log('staff.vue methods handleEdit')
    },
    handleBlockUp() {
      console.log('staff.vue methods handleBlockUp')
    },
    handleSizeChange(val) {
      console.log('staff.vue methods handleSizeChange', val, this.pageIndex)
    },
    handleCurrentChange(val) {
      console.log('staff.vue methods handleCurrentChange', val)
      this.pageIndex = val
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

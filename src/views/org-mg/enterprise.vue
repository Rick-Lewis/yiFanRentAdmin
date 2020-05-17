<template>
  <div class="enterprise-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="单位状态">
          <el-radio-group v-model="conditionForm.status" size="small">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="单位名称">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="单位名称" align="center" />
        <el-table-column prop="number" label="单位编号" align="center" />
        <el-table-column prop="admin" label="管理员" align="center" />
        <el-table-column prop="account" label="管理员账号" align="center" />
        <el-table-column prop="phone" label="管理员联系方式" align="center" />
        <el-table-column prop="status" label="状态" align="center" />
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleBlockUp(scope.$index, scope.row)">停用</el-button>
            <el-button size="mini">重置管理员密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="12" layout="total, prev, pager, next, sizes, jumper" :total="10" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Enterprise',
  components: {},
  data: function() {
    return {
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
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }, {
        id: '',
        name: '县政府',
        number: '0001',
        admin: '张三',
        account: '税务组',
        phone: '130000000000',
        status: '已启用'
      }],
      pageIndex: 1
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      console.log('enterprise.vue methods onSubmit')
    },
    handleEdit() {
      console.log('enterprise.vue methods handleEdit')
    },
    handleBlockUp() {
      console.log('enterprise.vue methods handleBlockUp')
    },
    handleSizeChange(val) {
      console.log('enterprise.vue methods handleSizeChange', val, this.pageIndex)
    },
    handleCurrentChange(val) {
      console.log('enterprise.vue methods handleCurrentChange', val)
      this.pageIndex = val
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

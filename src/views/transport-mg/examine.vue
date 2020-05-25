<template>
  <div class="examine-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="用车事由">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item label="随车人员">
            <el-select v-model="conditionForm.member" multiple placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in conditionForm.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="用车事由" align="center" />
        <el-table-column prop="note" label="随车人员" align="center" />
        <el-table-column prop="user.name" label="租用车型" align="center" />
        <el-table-column prop="user.username" label="申请人" align="center" />
        <el-table-column prop="user.username" label="申请单位" align="center" />
        <el-table-column prop="user.telephone" label="申请时间" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ scope.row.status ? '已启用' : '已停用' }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Examine',
  components: {},
  data: function() {
    return {
      conditionForm: {
        statusList: [{
          label: '-1',
          value: '全部'
        }, {
          label: '0',
          value: '待审批'
        }, {
          label: '1',
          value: '审批中'
        }, {
          label: '2',
          value: '审批通过'
        }],
        status: '-1',
        reason: '',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        member: ''
      },
      tableData: [],
      pageIndex: 0,
      pageSize: 5,
      total: 0
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSearch() {},
    handleRadioGroupChange(val) {
      console.log('enterprise.vue methods handleRadioGroupChange', val)
      // const dataTemp = {
      //   name: this.conditionForm.name,
      //   status: val === '-1' ? '' : val,
      //   pageIndex: 1,
      //   pageSize: this.pageSize
      // }
      // fetchEnterpriseList(dataTemp).then(res => {
      //   console.log('enterprise.vue mounted fetchEnterpriseList success', res)
      //   this.tableData.length = 0
      //   this.tableData.push(...res.data.data)
      //   this.total = res.data.total
      // }).catch(err => {
      //   console.log('enterprise.vue mounted fetchEnterpriseList failure', err)
      // })
    },
    handleAudit(index, row) {},
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>
<style lang='scss' scoped>
.examine-container{
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

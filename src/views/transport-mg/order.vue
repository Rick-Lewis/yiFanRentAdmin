<template>
  <div class="order-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="订单状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="(val) => handleRadioGroupChange(val, 'status')">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-radio-group v-model="conditionForm.with_driver" size="small" @change="(val) => handleRadioGroupChange(val, 'with_driver')">
            <el-radio v-for="(item, index) in conditionForm.withDriverList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用车事由">
          <el-date-picker
            v-model="conditionForm.duration"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd hh:mm:ss"
            :picker-options="conditionForm.pickerOptions"
          />
        </el-form-item>
        <div class="other-container">
          <el-form-item label="订单编号">
            <el-input v-model="conditionForm.order_no" placeholder="请输入订单编号" />
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model="conditionForm.plate_num" placeholder="请输入车牌号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="plate_num" label="车牌号" align="center" />
        <el-table-column prop="model_name" label="车型" align="center" />
        <el-table-column label="租车时间" align="center" width="300px">
          <template slot-scope="scope"><div>{{ scope.row.time_start + '至' + scope.row.time_end }}</div></template>
        </el-table-column>
        <el-table-column prop="price_total" label="费用（元）" align="center" />
        <el-table-column prop="with_driver" label="司机" align="center">
          <template slot-scope="scope"><div>{{ scope.row.with_driver === 0 ? '不需要' : '需要' }}</div></template>
        </el-table-column>
        <el-table-column prop="nick_name" label="租车人" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ getValueByStatus(scope.row) }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAudit(scope.$index, scope.row)">取消</el-button>
            <el-button size="mini" type="primary" @click="handleAudit(scope.$index, scope.row)">订单详情</el-button>
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
import { fetchOrder, fetchOrderStatus } from '@/api/transport-mg'
export default {
  name: 'Order',
  components: {},
  data: function() {
    return {
      conditionForm: {
        statusList: [{
          label: '-9',
          value: '全部'
        }],
        withDriverList: [{
          label: '-9',
          value: '全部'
        }, {
          label: '0',
          value: '无'
        }, {
          label: '1',
          value: '有'
        }],
        status: '-9',
        with_driver: '-9',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        duration: [],
        order_no: '',
        plate_num: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  computed: {},
  created() {
    fetchOrderStatus().then(res => {
      console.log('order.vue mounted fetchOrderStatus success', res)
      const temp = res.data.map(item => ({
        label: item.status + '',
        value: item.name
      }))
      this.conditionForm.statusList.push(...temp)
    }).catch(err => {
      console.log('order.vue mounted fetchOrderStatus failure', err)
    })
    const dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchOrder(dataTemp).then(res => {
      console.log('order.vue created fetchOrder success', res)
      this.tableData.length = 0
      this.tableData.push(...res.data.data)
      this.total = res.data.total
    }).catch(err => {
      console.log('order.vue created fetchOrder failure', err)
    })
  },
  mounted() {},
  methods: {
    getValueByStatus(item) {
      if (JSON.stringify(item) === '{}') {
        return ''
      }
      const result = this.conditionForm.statusList.find(i => i.label === (item.status + ''))
      return result.value
    },
    onSearch() {
      const dataTemp = {
        pageIndex: 1,
        pageSize: this.pageSize
      }
      if (this.conditionForm.status !== -9) {
        dataTemp['status'] = this.conditionForm.status
      }
      if (this.conditionForm.with_driver !== -9) {
        dataTemp['with_driver'] = this.conditionForm.with_driver
      }
      if (this.conditionForm.duration.length > 0) {
        dataTemp['time_start'] = this.conditionForm.duration[0]
        dataTemp['time_end'] = this.conditionForm.duration[1]
      }
      if (this.conditionForm.order_no) {
        dataTemp['order_no'] = this.conditionForm.order_no
      }
      if (this.conditionForm.plate_num) {
        dataTemp['plate_num'] = this.conditionForm.plate_num
      }
      fetchOrder(dataTemp).then(res => {
        console.log('order.vue mounted fetchOrder success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('order.vue mounted fetchOrder failure', err)
      })
    },
    handleRadioGroupChange(val, type) {
      console.log('order.vue methods handleRadioGroupChange', val, type, this.conditionForm.duration)
      const dataTemp = {
        pageIndex: 1,
        pageSize: this.pageSize
      }
      if (val !== '-9') {
        dataTemp[type] = val
      }
      if (this.conditionForm.duration.length > 0) {
        dataTemp['time_start'] = this.conditionForm.duration[0]
        dataTemp['time_end'] = this.conditionForm.duration[1]
      }
      if (this.conditionForm.order_no) {
        dataTemp['order_no'] = this.conditionForm.order_no
      }
      if (this.conditionForm.plate_num) {
        dataTemp['plate_num'] = this.conditionForm.plate_num
      }
      fetchOrder(dataTemp).then(res => {
        console.log('order.vue mounted fetchOrder success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('order.vue mounted fetchOrder failure', err)
      })
    },
    handleAudit(index, row) {},
    handleSizeChange(val) {
      console.log('order.vue methods handleSizeChange', val, this.pageIndex)
      this.pageSize = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchOrder(dataTemp).then(res => {
        console.log('order.vue handleSizeChange fetchOrder success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('order.vue handleSizeChange fetchOrder failure', err)
      })
    },
    handleCurrentChange(val) {
      console.log('order.vue methods handleCurrentChange', val)
      this.pageIndex = val
      const dataTemp = {
        status: this.conditionForm.status === '-1' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchOrder(dataTemp).then(res => {
        console.log('order.vue handleSizeChange fetchOrder success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('order.vue handleSizeChange fetchOrder failure', err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.order-container{
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

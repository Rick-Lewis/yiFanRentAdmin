<template>
  <div class="order-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="订单状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="(val) => handleRadioGroupChange(val, 'status')">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有无司机">
          <el-radio-group v-model="conditionForm.with_driver" size="small" @change="(val) => handleRadioGroupChange(val, 'with_driver')">
            <el-radio v-for="(item, index) in conditionForm.withDriverList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间查询">
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
        <el-table-column prop="order_no" label="订单号" align="center" />
        <el-table-column prop="plate_num" label="车牌号" align="center" />
        <el-table-column prop="model_name" label="车型" align="center" />
        <el-table-column label="租车时间" align="center" width="300px">
          <template slot-scope="scope"><div>{{ scope.row.time_start + '至' + scope.row.time_end }}</div></template>
        </el-table-column>
        <el-table-column prop="price_total" label="费用（元）" align="center" />
        <el-table-column prop="with_driver" label="司机" align="center">
          <template slot-scope="scope"><div>{{ scope.row.with_driver === 0 ? '不需要' : '需要' }}</div></template>
        </el-table-column>
        <!-- <el-table-column prop="nick_name" label="租车人" align="center" /> -->
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ getValueByStatus(scope.row) }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0 || scope.row.status === 1" size="mini" type="primary" @click="handleCancel(scope.$index, scope.row)">取消</el-button>
            <el-button size="mini" type="primary" @click="viewDetail(scope.$index, scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog title="订单详情" :visible.sync="dialogVisible" class="dialog-content">
      <div class="item-content">
        <div class="content-container">
          <div class="left">
            <div>
              <el-avatar shape="square" style="width: 180px; height: 100px; vertical-align: middle;" :src="orderDetail && orderDetail.model && 'https://www.901fan.com' + orderDetail.model.image" />
            </div>
            <div>
              <div style="margin-left: 10px;">{{ orderDetail && orderDetail.model && orderDetail.model.name }}</div>
              <div style="margin-left: 10px; margin-top: 10px;">
                <span>{{ orderDetail && orderDetail.model && orderDetail.model.let_litre }}</span>
                <el-divider direction="vertical" />
                <span>{{ orderDetail && orderDetail.model && orderDetail.model.seat_count }}座</span>
                <el-divider direction="vertical" />
                <span>油耗{{ orderDetail && orderDetail.model && orderDetail.model.oil_litre }}L</span></div>
            </div>
          </div>
          <div class="right">
            <span>{{ orderDetail && orderDetail.model && orderDetail.model.standard_price }}</span>
            <span>元</span>
            <span>/天</span>
          </div>
        </div>
      </div>
      <div class="item-content">
        <div class="content-container">
          <div class="right">
            <span>{{ orderDetail && orderDetail.order && orderDetail.order.time_start }}</span>
          </div>
          <div class="duration-container">{{ orderDetail && orderDetail.order && orderDetail.order.days }}天</div>
          <div class="right">
            <span>{{ orderDetail && orderDetail.order && orderDetail.order.time_end }}</span>
          </div>
        </div>
      </div>
      <div class="item-content">
        <div class="content-container">取车门店：{{ orderDetail && orderDetail.model && orderDetail.model.store_name }}</div>
      </div>
      <div class="item-content">
        <div class="content-container">
          <div style="width: 100%;">
            <div class="li-container">
              <div>车辆租金</div>
              <div>￥{{ orderDetail && orderDetail.fee_list && orderDetail.fee_list.rental_fee }}</div>
            </div>
            <!-- <div class="li-container">
              <div>基础保障服务费</div>
              <div>￥{{ orderDetail && orderDetail.fee_list && orderDetail.fee_list.service_fee }}</div>
            </div> -->
            <div class="li-container">
              <div>保险费</div>
              <div>￥{{ orderDetail && orderDetail.fee_list && orderDetail.fee_list.insurance_fee }}</div>
            </div>
            <div class="li-container">
              <div>合计</div>
              <div>￥{{ orderDetail && orderDetail.order && orderDetail.order.price_total }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-content">
        <div class="content-container">
          <div style="width: 100%;">
            <div>
              <el-alert
                title="取车须知"
                type="warning"
                show-icon
                :closable="false"
              >
                <div>1、需下单会员本人取车</div>
                <div>2、取车时请携带：二代身份证、驾驶证</div>
              </el-alert>
            </div>
            <div style="padding: 20px 0;">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                  <template slot="title"><span style="padding-left: 20px;">2020年第一次招商会议用车</span></template>
                  <div style="padding-left: 10px;">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchOrder, fetchOrderStatus, cancelOrder, fetchOrderDetail } from '@/api/transport-mg'
import { MessageBox } from 'element-ui'
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
      dialogVisible: false,
      activeNames: [],
      orderDetail: null,
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
    viewDetail(index, row) {
      this.dialogVisible = true
      fetchOrderDetail({ order_no: row.order_no }).then(res => {
        this.orderDetail = res.data
      }).catch(e => {})
    },
    handleCancel(index, row) {
      console.log('order.vue methods handleCancel', row)
      MessageBox.confirm(`你确定要取消订单${row.order_no}吗`, '确认取消', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrder({ order_no: row.order_no }).then(res => {
          row.status = -1
        }).catch(e => {})
      })
    },
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
      if (this.conditionForm.status !== '-9') {
        dataTemp['status'] = this.conditionForm.status
      }
      if (this.conditionForm.with_driver !== '-9') {
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
  .dialog-content{
    min-height: calc(100vh - 84px);
    // background-color: #eef0f3;
    padding: 16px;
    .item-content{
        background-color: #ffffff;
        display: flex;
        &:not(:last-child){
            margin-bottom: 1px
        }
        .content-container{
            width: 590px;
            padding: 20px 0;
            margin: auto;
            display: flex;
            justify-content: space-between;
            .left{
                display: flex;
            }
            .right{
                align-self: center;
            }
            .duration-container{
                width: 50px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                border: 1px solid #999;
                border-radius: 4px;
                position: relative;
                &::before{
                    content: '';
                    width: 60px;
                    height: 1px;
                    background-color: #999;
                    position: absolute;
                    left: -61px;
                    top: 25px;
                }
                &::after{
                    content: '';
                    width: 60px;
                    height: 1px;
                    background-color: #999;
                    position: absolute;
                    left: 49px;
                    top: 25px;
                }
            }
            .li-container{
                display: flex;
                justify-content: space-between;
                &:not(:last-child){
                    margin-bottom: 10px;
                }
            }
            .el-collapse{
                border: none;
                /deep/.el-collapse-item__header{
                    border: none;
                    background-color: #f6f6f6;
                }
                /deep/.el-collapse-item__wrap{
                    border: none;
                }
            }
        }
    }
  }
}
</style>

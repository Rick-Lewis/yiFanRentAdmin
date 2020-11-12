<template>
  <div class="application-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small" @change="handleRadioGroupChange">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="审批编号">
            <el-input v-model="conditionForm.serialno" placeholder="请输入审批编号" />
          </el-form-item>
          <el-form-item label="用车事由">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item label="随车人员">
            <el-select v-model="conditionForm.member" multiple collapse-tags placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in conditionForm.options"
                :key="item.value"
                :label="item.label"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="handleAppAddition">+用车申请</el-button></div>
    <div class="content">
      <template>
        <div v-for="(item, index) in tableData" :key="index" class="card-container">
          <div class="card-header">审批编号：{{ item.serialno }}</div>
          <div class="card-content">
            <div style="flex: 6;">
              <div>
                <div style="font-size: 18px;">{{ item.reason }}</div>
                <div style="color: #9e9e9e;">{{ item.applicant_name }} 于 {{ item.time_create }} 申请</div>
              </div>
              <div>
                <div style="color: #9e9e9e;">行车路线：{{ item.lines }}</div>
                <!-- <div style="margin-top: 5px;">返：吉首市高铁站-古丈县宾馆</div> -->
              </div>
            </div>
            <el-divider direction="vertical" />
            <div style="flex: 6;">备注：{{ item.note }}</div>
            <el-divider direction="vertical" />
            <div style="flex: 6;">
              <div>
                <span>随车人员：</span>
                <el-tag v-for="(ite, i) in (item.member_name && item.member_name.split(','))" :key="i" size="small" style="margin-right: 5px;">{{ ite }}</el-tag>
              </div>
              <div style="margin-top: 16px;">司机：{{ item.with_driver === 0 ? '自备' : '准备中' }}</div>
            </div>
            <el-divider direction="vertical" />
            <div style="flex: 2;" class="card-item-container">{{ getValueByStatus(item) }}</div>
            <el-divider direction="vertical" />
            <div style="flex: 4;" class="card-item-container">
              <div v-if="item.status === 0 || item.status === 1"><el-link type="primary" @click="handleOptClick(item)">撤销</el-link></div>
              <div v-if="item.status === 2 && !item.orderno" style="margin-top: 10px;"><el-link type="primary" @click="handleOptClick(item)">去下单</el-link></div>
              <div v-if="item.status === -1 || item.status === -2" style="margin-top: 10px;"><el-link type="primary" @click="handleOptClick(item)">编辑</el-link></div>
              <div style="margin-top: 10px;"><el-link type="primary" @click="handleViewDetail(item)">查看详情</el-link></div>
              <div v-if="item.status !== -1 && item.status !== -2" style="margin-top: 10px;" @click="handleProcessClick(item)"><el-link type="primary">进度</el-link></div>
            </div>
          </div>
          <div v-if="item.status !== -1 && item.status !== -2" class="card-footer">
            <el-collapse v-model="item.activeNames" :accordion="true" @change="handleClapChange">
              <el-collapse-item title="" name="1">
                <el-steps :active="item.active" finish-status="success" align-center>
                  <el-step title="待审批" />
                  <el-step title="审批中" />
                  <el-step title="审批通过" />
                </el-steps>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div v-if="tableData.length === 0" class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
      </template>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog title="申请详情" :visible.sync="dialogVisible" class="dialog-content">
      <div class="card-container" style="padding-top: 0;">
        <div class="card-header">
          <span>审批编号：{{ activeItemDetail.serialno }}</span>
          <span v-if="activeItemDetail.next_checker">（下一个审批人:{{ activeItemDetail.next_checker.checker }}）</span>
        </div>
        <div class="card-content" style="padding-top: 10px;">
          <div style="flex: 8;">
            <div>
              <div style="font-size: 18px;">{{ activeItemDetail.reason }}</div>
              <div style="color: #9e9e9e;">{{ activeItemDetail.applicant_name }} 于 {{ activeItemDetail.time_create }} 申请</div>
            </div>
            <div style="color: #9e9e9e;">行车路线：{{ activeItemDetail.lines }}</div>
          </div>
          <el-divider direction="vertical" />
          <div style="flex: 6;">备注：{{ activeItemDetail.note }}</div>
          <el-divider direction="vertical" />
          <div style="flex: 6;">
            <div>
              <span>随车人员：</span>
              <el-tag v-for="(ite, i) in (activeItemDetail.member_name && activeItemDetail.member_name.split(','))" :key="i" size="small" style="margin-right: 5px;">{{ ite }}</el-tag>
            </div>
            <div style="margin-top: 16px;">司机：{{ activeItemDetail.with_driver === 0 ? '自备' : '准备中' }}</div>
          </div>
          <el-divider direction="vertical" />
          <div class="card-item-container" style="flex: 4;">{{ getValueByStatus(activeItemDetail) }}</div>
        </div>
        <div class="card-footer" style="margin-top: 20px;">
          <el-steps :active="activeItemDetail.active" finish-status="success" align-center>
            <el-step v-for="(item, index) in activeItemDetail.checkFlowList" :key="index" :title="item.name" />
          </el-steps>
        </div>
      </div>
      <!-- <el-table :data="activeItemDetail.checkFlowList" border style="width: 100%">
        <el-table-column prop="index" label="审核步骤" align="center" />
        <el-table-column prop="name" label="审核名称" align="center" />
        <el-table-column prop="checker" label="审核人" align="center" />
        <el-table-column prop="enterprise_name" label="公司名称" align="center" />
      </el-table> -->
    </el-dialog>
  </div>
</template>
<script>
import { fetchStaffList } from '@/api/org-mg'
import { fetchApplicationList, applicationCancel, fetchStatus, fetchApplicationDetail } from '@/api/transport-mg'
// import { Message } from 'element-ui'
export default {
  name: 'Application',
  components: {},
  data: function() {
    return {
      dialogVisible: false,
      activeItemDetail: {}, // 申请详情
      conditionForm: {
        statusList: [{
          label: '-9',
          value: '全部'
        }],
        status: '-9',
        reason: '',
        options: [],
        member: '',
        serialno: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  computed: {},
  created() {
    console.log('application.vue created', this.$route)
  },
  mounted() {
    let dataTemp = {
      pageIndex: 1,
      pageSize: 1000
    }
    fetchStaffList(dataTemp).then(res => {
      console.log('application.vue mounted fetchStaffList success', res)
      this.conditionForm.options.push(...res.data.data.map(item => ({
        value: item.id,
        label: item.name
      })))
    }).catch(err => {
      console.log('application.vue mounted fetchStaffList failure', err)
    })
    fetchStatus().then(res => {
      console.log('application.vue mounted fetchStatus success', res)
      const temp = res.data.map(item => ({
        label: item.status + '',
        value: item.name
      }))
      this.conditionForm.statusList.push(...temp)
    }).catch(err => {
      console.log('application.vue mounted fetchStatus failure', err)
    })
    dataTemp = {
      sortField: 'time_create',
      sortOrder: 'desc',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchApplicationList(dataTemp).then(res => {
      console.log('application.vue mounted fetchStaffList success', res)
      const temp = res.data.data.map(item => {
        let temp = 0
        switch (item.status) {
          case 0: // 待审批
            temp = 0
            break
          case 1: // 审批中
            temp = 1
            // if (item.is_check === 1) {
            //   temp = 0
            // } else if (item.is_check === 2 && item.is_confirm === 1) {
            //   temp = 3
            // } else if (item.is_check === 2) {
            //   temp = 1
            // }
            break
          case 2: // 已通过
            temp = 3
            break
          case -1: // 已撤销
          case -2: // 已驳回
            break
        }
        return Object.assign({}, item, {
          activeNames: [],
          active: temp
        })
      })
      this.tableData.push(...temp)
      this.total = res.data.total
    }).catch(err => {
      console.log('application.vue mounted fetchStaffList failure', err)
    })
  },
  methods: {
    refreshData() {
      const dataTemp = {
        reason: this.conditionForm.reason,
        status: this.conditionForm.status === '-9' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchApplicationList(dataTemp).then(res => {
        console.log('application.vue mounted fetchApplicationList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('application.vue mounted fetchApplicationList failure', err)
      })
    },
    handleViewDetail(item) {
      console.log('application.vue handleViewDetail', item)
      fetchApplicationDetail({ serialno: item.serialno }).then(res => {
        console.log('application.vue mounted fetchApplicationDetail success', res)
        let temp = 0
        switch (res.data.status) {
          case 0: // 待审批
            temp = 0
            break
          case 1: // 审批中
            temp = res.data.checkFlowList.findIndex(item => item.check_user === res.data.next_checker)
            // if (item.is_check === 1) {
            //   temp = 0
            // } else if (res.data.is_check === 2 && res.data.is_confirm === 1) {
            //   temp = 3
            // } else if (res.data.is_check === 2) {
            //   temp = 1
            // }
            break
          case 2: // 已通过
            temp = res.data.checkFlowList.length
            break
          case -1: // 已撤销
          case -2: // 已驳回
            temp = -1
            break
        }
        this.activeItemDetail = Object.assign({}, res.data, {
          active: temp,
          next_checker: res.data.checkFlowList.find(item => item.check_user === res.data.next_checker)
        })
        this.dialogVisible = true
      }).catch(err => {
        console.log('application.vue mounted fetchApplicationDetail failure', err)
      })
    },
    getValueByStatus(item) {
      if (JSON.stringify(item) === '{}') {
        return ''
      }
      let temp = item.status
      switch (item.status) {
        case 0: // 待审批
          temp = 0
          break
        case 1: // 审批中
          temp = 1
          // if (item.is_check === 1) {
          //   temp = 0
          // } else if (item.is_check === 2 && item.is_confirm === 1) {
          //   temp = 2
          // } else if (item.is_check === 2) {
          //   temp = 1
          // }
          break
        case 2: // 已通过
          break
        case -1: // 已撤销
        case -2: // 已驳回
          break
      }
      const result = this.conditionForm.statusList.find(i => i.label === (temp + ''))
      return result.value
    },
    // handleEditClick(item) {
    //   this.$router.push({ path: '/transport-mg/application-filled', query: { action: 'edit', id: item.id }})
    // },
    handleOptClick(item) {
      console.log('applictation.vue methods handleOptClick', item)
      const dataTemp = {
        id: item.id
      }
      switch (item.status) {
        case 0:
        case 1:
          this.$confirm('确定撤销吗？').then(_ => {
            applicationCancel(dataTemp).then(res => {
              console.log('application.vue methods applicationCancel success', res)
              this.refreshData()
            }).catch(err => {
              console.log('application.vue methods applicationCancel failure', err)
            })
          }).catch(_ => {})
          break
        case 2:
          this.$router.push({ path: '/transport-mg/create-order', query: { time_start: item.time_start, time_end: item.time_end, serialno: item.serialno }})
          break
        case -1:
        case -2:
          this.$router.push({ path: '/transport-mg/application-filled', query: { action: 'edit', id: item.id }})
          break
      }
    },
    handleRadioGroupChange(val) {
      console.log('application.vue methods handleRadioGroupChange', val)
      this.status = val
      const dataTemp = {
        reason: this.conditionForm.reason,
        member_name: this.conditionForm.member.map(item => item.label).join(','),
        status: val === '-9' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchApplicationList(dataTemp).then(res => {
        console.log('application.vue methods fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('application.vue methods fetchEnterpriseList failure', err)
      })
    },
    handleAppAddition() {
      console.log('application.vue methods handleAppAddition')
      this.$router.push({ path: '/transport-mg/application-filled' })
    },
    onSubmit() {
      console.log('application.vue methods onSubmit')
      const dataTemp = {
        reason: this.conditionForm.reason,
        member_name: this.conditionForm.member.map(item => item.label).join(','),
        serialno: this.conditionForm.serialno,
        status: this.status === '-9' ? '' : this.status,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchApplicationList(dataTemp).then(res => {
        console.log('application.vue methods onSubmit fetchApplicationList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('application.vue methods onSubmit fetchApplicationList failure', err)
      })
    },
    handleProcessClick(item) {
      if (item.activeNames.length > 0) {
        item.activeNames = []
      } else {
        item.activeNames = ['1']
      }
    },
    handleClapChange(val) {
      console.log('application.vue handleClapChange', val)
    },
    handleSizeChange(val) {
      console.log('examine.vue methods handleSizeChange', val, this.pageIndex)
      this.pageSize = val
      const dataTemp = {
        reason: this.conditionForm.reason,
        status: this.conditionForm.status === '-9' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchApplicationList(dataTemp).then(res => {
        console.log('application.vue mounted fetchStaffList success', res)
        const temp = res.data.data.map(item => {
          let temp = 0
          switch (item.status) {
            case 0: // 待审批
              temp = 0
              break
            case 1: // 审批中
              res.data.checkFlowList.findIndex(item => item.check_user === res.data.next_checker)
              // if (item.is_check === 1) {
              //   temp = 0
              // } else if (item.is_check === 2 && item.is_confirm === 1) {
              //   temp = 3
              // } else if (item.is_check === 2) {
              //   temp = 1
              // }
              break
            case 2: // 已通过
              temp = res.data.checkFlowList.length
              break
            case -1: // 已撤销
            case -2: // 已驳回
              temp = -1
              break
          }
          return Object.assign({}, item, {
            activeNames: [],
            active: temp
          })
        })
        this.tableData.length = 0
        this.tableData.push(...temp)
        this.total = res.data.total
      }).catch(err => {
        console.log('application.vue mounted fetchStaffList failure', err)
      })
    },
    handleCurrentChange(val) {
      console.log('examine.vue methods handleCurrentChange', val)
      this.pageIndex = val
      const dataTemp = {
        reason: this.conditionForm.reason,
        status: this.conditionForm.status === '-9' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchApplicationList(dataTemp).then(res => {
        console.log('application.vue mounted fetchStaffList success', res)
        const temp = res.data.data.map(item => {
          let temp = 0
          switch (item.status) {
            case 0: // 待审批
              temp = 0
              break
            case 1: // 审批中
              res.data.checkFlowList.findIndex(item => item.check_user === res.data.next_checker)
              // if (item.is_check === 1) {
              //   temp = 0
              // } else if (item.is_check === 2 && item.is_confirm === 1) {
              //   temp = 3
              // } else if (item.is_check === 2) {
              //   temp = 1
              // }
              break
            case 2: // 已通过
              temp = res.data.checkFlowList.length
              break
            case -1: // 已撤销
            case -2: // 已驳回
              temp = -1
              break
          }
          return Object.assign({}, item, {
            activeNames: [],
            active: temp
          })
        })
        this.tableData.length = 0
        this.tableData.push(...temp)
        this.total = res.data.total
      }).catch(err => {
        console.log('application.vue mounted fetchStaffList failure', err)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.application-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  font-size: 14px;
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
  @mixin common{
    .card-container{
      background-color: #ffffff;
      padding-top: 16px;
      &:not(:last-child){
        margin-bottom: 16px;
      }
      .card-header{
        padding-left: 22px;
        color: #9e9e9e;
      }
      .card-content{
        display: flex;
        padding: 0 22px 10px 22px;
        justify-content: flex-start;
        align-items: center;
        line-height: 1.5;
        // border-bottom: 1px solid #DCDFE6;
        .el-divider--vertical{
          height: 80px;
        }
        .card-item-container{
          flex-grow: 1;
          text-align: center;
        }
      }
      .card-footer{
        /deep/.el-collapse{
          padding: 0 22px;
          border-bottom: none;
          /deep/.el-collapse-item__header{
            border-bottom: none;
          }
          /deep/.el-collapse-item__wrap{
            border-bottom: none;
          }
        }
      }
    }
  }
  .content{
    margin-top: 10px;
    @include common;
    .el-table__empty-block {
      min-height: 60px;
      text-align: center;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      .el-table__empty-text {
        line-height: 60px;
        width: 50%;
        color: #909399;
      }
    }
    .pagination-cocntainer{
      text-align: right;
      margin-top: 16px;
      & > div{
        padding: 0;
      }
    }
  }
  .dialog-content{
    @include common;
  }
}
</style>

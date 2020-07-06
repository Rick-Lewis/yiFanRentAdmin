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
        <el-table-column prop="reason" label="用车事由" align="center" />
        <el-table-column prop="applicant_name" label="申请人" align="center" />
        <el-table-column prop="serialno" label="申请单号" align="center" />
        <el-table-column prop="time_create" label="申请时间" align="center" />
        <el-table-column prop="member_name" label="随车人员" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope"><div>{{ getValueByStatus(scope.row) }}</div></template>
        </el-table-column>
        <el-table-column prop="action" label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button v-if="(scope.row.status === 0 || scope.row.status === 1) && scope.row.next_checker === (userInfo.id + '')" size="mini" type="primary" @click="handleAudit(scope.$index, scope.row)">审核</el-button>
            <el-button size="mini" type="primary" @click="handleViewDetail(scope.row, 'detail')">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-cocntainer">
        <el-pagination background :page-sizes="[5, 8, 10]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" :current-page="pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog title="申请详情" :visible.sync="dialogConfig.dialogVisible" class="dialog-content">
      <div class="card-container">
        <div class="card-header">审批编号：{{ activeItemDetail.serialno }}</div>
        <div class="card-content">
          <div class="col-container">
            <div>
              <div style="font-size: 20px;">{{ activeItemDetail.reason }}</div>
              <div>{{ activeItemDetail.applicant_name }} 于 {{ activeItemDetail.time_create }} 申请</div>
            </div>
            <div>
              <div>往：古丈县县政府大楼-吉首市高铁站</div>
              <div style="margin-top: 5px;">返：吉首市高铁站-古丈县宾馆</div>
            </div>
            <div>备注：{{ activeItemDetail.note }}</div>
          </div>
          <el-divider direction="vertical" />
          <div>
            <div>
              <span>随车人员：</span>
              <el-tag v-for="(ite, i) in (activeItemDetail.member_name && activeItemDetail.member_name.split(','))" :key="i" size="small">{{ ite }}</el-tag>
            </div>
            <div style="margin-top: 16px;">司机：{{ activeItemDetail.with_driver === 0 ? '自备' : '准备中' }}</div>
          </div>
          <el-divider direction="vertical" />
          <div>{{ getValueByStatus(activeItemDetail) }}</div>
          <div />
        </div>
        <div class="card-footer" style="margin-top: 20px;">
          <el-steps :active="activeItemDetail.active" finish-status="success" align-center>
            <el-step title="待领导审批" />
            <el-step title="待公车办审批" />
            <el-step title="审批完成" />
          </el-steps>
        </div>
        <div v-if="dialogConfig.currentStatus === 'audit'" style="margin-top: 30px;">
          <el-form ref="auditForm" :model="auditForm" :rules="auditForm.rules" label-width="95px" label-suffix="：">
            <el-form-item label="审批结果" prop="status">
              <el-radio-group v-model="auditForm.status" size="small">
                <el-radio v-for="(item, index) in auditForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见" prop="opinion">
              <el-input v-model="auditForm.opinion" type="textarea" :rows="4" placeholder="同意/不同意，都请书审批意见" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button @click="dialogConfig.dialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="tableData.length === 0" class="el-table__empty-block"><span class="el-table__empty-text">暂无数据</span></div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchStaffList } from '@/api/org-mg'
import { fetchAppList, fetchStatus, fetchApplicationDetail, checkRefuse, checkPass } from '@/api/transport-mg'
import { Message } from 'element-ui'
export default {
  name: 'Examine',
  components: {},
  data: function() {
    return {
      auditForm: {
        rules: {
          status: [
            { required: true, message: '请选择同意/不同意', trigger: 'change' }
          ],
          opinion: [
            { required: true, message: '请输入审批意见', trigger: 'blur' }
          ]
        },
        opinion: '',
        status: '1',
        statusList: [{
          label: '1',
          value: '同意'
        }, {
          label: '0',
          value: '不同意'
        }]
      },
      userInfo: {},
      dialogConfig: {
        dialogVisible: false,
        currentStatus: 'detail'
      },
      activeItemDetail: {}, // 申请详情
      // currentIndex: -1, // 记录当前状态下操作的目标数据的索引
      conditionForm: {
        statusList: [{
          label: '-9',
          value: '全部'
        }],
        status: '-9',
        reason: '',
        options: [],
        member: ''
      },
      tableData: [],
      pageIndex: 0,
      pageSize: 5,
      total: 0
    }
  },
  computed: {},
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    console.log('examine.vue created', this.userInfo)
    let dataTemp = {
      pageIndex: 1,
      pageSize: 1000
    }
    fetchStaffList(dataTemp).then(res => {
      console.log('examine.vue mounted fetchStaffList success', res)
      this.conditionForm.options.push(...res.data.data.map(item => ({
        value: item.id,
        label: item.name
      })))
    }).catch(err => {
      console.log('examine.vue mounted fetchStaffList failure', err)
    })
    dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchAppList(dataTemp).then(res => {
      console.log('examine.vue mounted fetchAppList success', res)
      this.tableData.push(...res.data.data)
      this.total = res.data.total
    }).catch(err => {
      console.log('examine.vue mounted fetchAppList failure', err)
    })
    fetchStatus().then(res => {
      console.log('examine.vue mounted fetchStatus success', res)
      const temp = res.data.map(item => ({
        label: item.status + '',
        value: item.name
      }))
      this.conditionForm.statusList.push(...temp)
    }).catch(err => {
      console.log('examine.vue mounted fetchStatus failure', err)
    })
  },
  mounted() {},
  methods: {
    // refreshView() {
    //   // In order to make the cached page re-rendered
    //   this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

    //   const { fullPath } = this.$route

    //   this.$nextTick(() => {
    //     this.$router.replace({
    //       path: '/redirect' + fullPath
    //     })
    //   })
    // },
    refreshData() {
      const dataTemp = {
        reason: this.conditionForm.reason,
        status: this.conditionForm.status === '-9' ? '' : this.conditionForm.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      fetchAppList(dataTemp).then(res => {
        console.log('examine.vue mounted fetchAppList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('examine.vue mounted fetchAppList failure', err)
      })
    },
    onSubmit() {
      console.log('examine.vue onSubmit')
      this.$refs['auditForm'].validate((valid) => {
        if (valid) {
          if (this.auditForm.status === '0') { // 不同意
            checkRefuse({ id: this.activeItemDetail.id, message: this.auditForm.opinion }).then(res => {
              console.log('examine.vue mounted checkRefuse success', res)
              if (res.code === 0) {
                Message.success(res.message)
                this.refreshData()
              } else {
                Message.warning(res.message)
              }
              this.dialogConfig.dialogVisible = false
            }).catch(err => {
              console.log('examine.vue mounted checkRefuse failure', err)
            })
          } else {
            checkPass({ id: this.activeItemDetail.id, message: this.auditForm.opinion }).then(res => {
              console.log('examine.vue mounted checkPass success', res)
              if (res.code === 0) {
                Message.success(res.message)
                this.refreshData()
              } else {
                Message.warning(res.message)
              }
              this.dialogConfig.dialogVisible = false
            }).catch(err => {
              console.log('examine.vue mounted checkPass failure', err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleViewDetail(item, type) {
      console.log('examine.vue handleViewDetail', item)
      this.dialogConfig.currentStatus = type
      fetchApplicationDetail({ id: item.id }).then(res => {
        console.log('examine.vue mounted fetchApplicationDetail success', res)
        let temp = 0
        switch (res.data.status) {
          case 0: // 待审批
            temp = 0
            break
          case 1: // 审批中
            if (item.is_check === 1) {
              temp = 0
            } else if (res.data.is_check === 2 && res.data.is_confirm === 1) {
              temp = 3
            } else if (res.data.is_check === 2) {
              temp = 1
            }
            break
          case 2: // 已通过
            temp = 3
            break
          case -1: // 已撤销
          case -2: // 已驳回
            break
        }
        this.activeItemDetail = Object.assign({}, res.data, {
          active: temp
        })
        this.dialogConfig.dialogVisible = true
      }).catch(err => {
        console.log('examine.vue mounted fetchApplicationDetail failure', err)
      })
    },
    getValueByStatus(item) {
      console.log(this.conditionForm.statusList, item)
      if (this.conditionForm.statusList.length === 0 || JSON.stringify(item) === '{}') {
        return ''
      }
      const result = this.conditionForm.statusList.find(i => i.label === (item.status + ''))
      if (!result) {
        return ''
      }
      return result.value
    },
    onSearch() {},
    handleRadioGroupChange(val) {
      console.log('examine.vue methods handleRadioGroupChange', val)
      this.status = val
      const dataTemp = {
        reason: this.conditionForm.reason,
        member_name: this.conditionForm.member.map(item => item.label).join(','),
        status: val === '-9' ? '' : val,
        pageIndex: 1,
        pageSize: this.pageSize
      }
      fetchAppList(dataTemp).then(res => {
        console.log('examine.vue methods fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('examine.vue methods fetchEnterpriseList failure', err)
      })
    },
    handleAudit(index, row) {
      // this.currentIndex = index
      this.handleViewDetail(row, 'audit')
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
      fetchAppList(dataTemp).then(res => {
        console.log('examine.vue handleSizeChange fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('examine.vue handleSizeChange fetchEnterpriseList failure', err)
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
      fetchAppList(dataTemp).then(res => {
        console.log('examine.vue handleSizeChange fetchEnterpriseList success', res)
        this.tableData.length = 0
        this.tableData.push(...res.data.data)
        this.total = res.data.total
      }).catch(err => {
        console.log('examine.vue handleSizeChange fetchEnterpriseList failure', err)
      })
    }
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
  .dialog-content{
      margin-top: 10px;
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
          padding: 16px 0 16px 22px;
          justify-content: space-between;
          align-items: center;
          // border-bottom: 1px solid #DCDFE6;
          .col-container{
            & > div:first-child{
              display: flex;
              align-items: center;
              & > div:last-child{
                color: #9e9e9e;
                margin-left: 16px;
              }
            }
            & > div:nth-child(2){
              padding: 16px 0;
            }
            & > div:last-child{
              color: #9e9e9e;
            }
          }
          .el-divider--vertical{
            height: 80px;
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
    }
}
</style>

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
            <div class="col-container">
              <div>
                <div style="font-size: 20px;">{{ item.reason }}</div>
                <div>{{ item.applicant_name }} 于 {{ item.time_create }} 申请</div>
              </div>
              <div>
                <div>往：古丈县县政府大楼-吉首市高铁站</div>
                <div style="margin-top: 5px;">返：吉首市高铁站-古丈县宾馆</div>
              </div>
              <div>备注：{{ item.note }}</div>
            </div>
            <el-divider direction="vertical" />
            <div>
              <div>
                <span>随车人员：</span>
                <el-tag v-for="(ite, i) in item.member.split(',')" :key="i" size="small">{{ ite }}</el-tag>
              </div>
              <div style="margin-top: 16px;">司机：{{ item.with_driver === 0 ? '自备' : '' }}</div>
            </div>
            <el-divider direction="vertical" />
            <div>待审批</div>
            <el-divider direction="vertical" />
            <div style="padding-right: 100px;">
              <div><el-link type="primary">撤销</el-link></div>
              <div style="margin-top: 16px;" @click="handleProcessClick(item)"><el-link type="primary">进度</el-link></div>
            </div>
          </div>
          <div class="card-footer">
            <el-collapse v-model="item.activeNames" :accordion="true" @change="handleClapChange">
              <el-collapse-item title="" name="1">
                <el-steps :active="1" finish-status="success" align-center>
                  <el-step title="待领导审批" />
                  <el-step title="待公车办审批" />
                  <el-step title="审批完成" />
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
  </div>
</template>
<script>
import { fetchApplicationList, fetchStaffList } from '@/api/org-mg'
// import { Message } from 'element-ui'
export default {
  name: 'Application',
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
        }, {
          label: '3',
          value: '已撤销'
        }],
        status: '-1',
        reason: '',
        options: [],
        member: ''
      },
      tableData: [],
      pageIndex: 1,
      pageSize: 5,
      total: 0
    }
  },
  computed: {},
  created() {},
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
    dataTemp = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    fetchApplicationList(dataTemp).then(res => {
      console.log('application.vue mounted fetchStaffList success', res)
      const temp = res.data.data.map(item => Object.assign({}, item, {
        activeNames: []
      }))
      this.tableData.push(...temp)
      this.total = res.data.total
    }).catch(err => {
      console.log('application.vue mounted fetchStaffList failure', err)
    })
  },
  methods: {
    handleRadioGroupChange(val) {
      console.log('application.vue methods handleRadioGroupChange', val)
      const dataTemp = {
        reason: this.conditionForm.reason,
        member: this.conditionForm.member,
        status: val === '-1' ? '' : val,
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
        member: this.conditionForm.member,
        status: this.status === '-1' ? '' : this.status,
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
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>
<style lang='scss' scoped>
.application-container{
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
}
</style>

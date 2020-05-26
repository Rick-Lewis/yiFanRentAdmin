<template>
  <div class="application-filled-container">
    <el-steps :active="1" finish-status="success" align-center>
      <el-step title="待领导审批" />
      <el-step title="待公车办审批" />
      <el-step title="审批完成" />
    </el-steps>
    <div class="content">
      <div class="header">申请信息</div>
      <div class="main">
        <el-form ref="form" :model="form" label-width="100px">
          <div>
            <el-form-item label="申请人"><el-input v-model="form.applicant_name" placeholder="请输入申请人姓名" /></el-form-item>
            <el-form-item label="申请人电话"><el-input v-model="form.applicant_tel" placeholder="请输入申请人电话" /></el-form-item>
          </div>
          <el-form-item label="用车事由">
            <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请描述用车事由" />
          </el-form-item>
          <el-form-item label="用车时间">
            <el-date-picker
              v-model="form.duration"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="随车人员">
            <el-select v-model="form.member" multiple placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="行车路线">
            <el-input v-model="form.lines" type="textarea" :rows="4" placeholder="请按照实际计划输入车辆所到地点" />
          </el-form-item>
          <el-form-item label="司机">
            <el-radio-group v-model="form.with_driver">
              <el-radio :label="1">需要</el-radio>
              <el-radio :label="0">不需要</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" :rows="4" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item style="padding-bottom: 16px;">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchStaffList, addApplication } from '@/api/org-mg'
export default {
  name: 'ApplicationFilled',
  data: function() {
    return {
      form: {
        applicant_name: '',
        applicant_tel: '',
        reason: '',
        duration: [],
        options: [],
        member: [],
        lines: '',
        with_driver: 0,
        note: ''
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    const dataTemp = {
      pageIndex: 1,
      pageSize: 1000
    }
    fetchStaffList(dataTemp).then(res => {
      console.log('staff.vue mounted fetchStaffList success', res)
      this.form.options.push(...res.data.data.map(item => ({
        value: item.id,
        label: item.name
      })))
    }).catch(err => {
      console.log('staff.vue mounted fetchStaffList failure', err)
    })
  },
  methods: {
    onSubmit() {
      console.log('application-filled.vue methods onSubmit')
      addApplication(this.form).then(res => {
        console.log('staff.vue methods onSubmit addApplication success', res)
      }).catch(err => {
        console.log('staff.vue methods onSubmit addApplication failure', err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.application-filled-container{
  min-height: calc(100vh - 84px);
  background-color: #eef0f3;
  padding: 16px;
  .content{
    background-color: #ffffff;
    padding-top: 16px;
    padding-right: 40%;
    margin-top: 10px;
    .header{
      padding: 0 16px 16px 16px;
    }
    .main{
      padding-left: 20px;
    }
  }
}
</style>

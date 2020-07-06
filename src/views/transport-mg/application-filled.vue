<template>
  <div class="application-filled-container">
    <el-steps :active="0" finish-status="success" align-center>
      <el-step title="填写用车申请" />
      <el-step title="进行审批" />
      <el-step title="生成订单" />
    </el-steps>
    <div class="content">
      <div class="header">申请信息</div>
      <div class="main">
        <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
          <div>
            <el-form-item label="申请人" prop="applicant">
              <el-select v-model="form.applicant" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in form.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="申请人电话" prop="applicant_tel">
              <el-input v-model="form.applicant_tel" placeholder="请输入申请人电话" /></el-form-item>
          </div>
          <el-form-item label="用车事由" prop="reason">
            <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请描述用车事由" />
          </el-form-item>
          <el-form-item label="用车时间" prop="duration">
            <el-date-picker
              v-model="form.duration"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="随车人员">
            <el-select v-model="form.member" multiple placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in form.options"
                :key="item.value"
                :label="item.label"
                :value="item"
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
            <el-button @click="back">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchStaffList } from '@/api/org-mg'
import { addApplication, fetchApplicationDetail, resubmit } from '@/api/transport-mg'
import { Message } from 'element-ui'
export default {
  name: 'ApplicationFilled',
  data: function() {
    var validateDuration = (rule, value, callback) => {
      console.log(rule, value)
      const now = new Date().getTime()
      const start = new Date(value[0]).getTime()
      const end = new Date(value[1]).getTime()
      if (end - start < 24 * 60 * 60 * 1000) {
        return callback(new Error('用车时间不能少于1天'))
      }
      if (start - now < 2 * 60 * 60 * 1000) {
        return callback(new Error('用车时间不能少于当前两小时'))
      }
      callback()
    }
    return {
      form: {
        applicant: '',
        applicant_tel: '',
        reason: '',
        duration: [],
        options: [],
        member: [],
        lines: '',
        with_driver: 0,
        note: ''
      },
      formRules: {
        applicant: [{ required: true, message: '请选择申请人', trigger: ['blur', 'change'] }],
        applicant_tel: [{ required: true, message: '请输入申请人电话', trigger: ['blur'] }],
        reason: [{ required: true, message: '请输入用车事由', trigger: ['blur'] }],
        duration: [{ required: true, message: '请选择用车时间', trigger: ['blur'] }, { validator: validateDuration, trigger: 'blur' }]
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
      console.log('application-filled.vue mounted fetchStaffList success', res)
      this.form.options.push(...res.data.data.map(item => ({
        value: item.id,
        label: item.name
      })))
    }).catch(err => {
      console.log('application-filled.vue mounted fetchStaffList failure', err)
    })
    if (this.$route.query.action === 'edit') {
      fetchApplicationDetail({ id: this.$route.query.id }).then(res => {
        console.log('application-filled.vue mounted fetchApplicationDetail success', res)
        const temp1 = res.data.member.split(',')
        const temp2 = res.data.member_name.split(',')
        const temp3 = temp1.map((item, index) => ({
          label: temp2[index],
          value: parseInt(item)
        }))
        console.log(temp3)
        this.form = Object.assign({}, this.form, {
          id: res.data.id,
          applicant: {
            label: res.data.applicant_name,
            value: res.data.applicant_id
          },
          applicant_tel: res.data.applicant_tel,
          reason: res.data.reason,
          duration: [res.data.time_start, res.data.time_end],
          member: [...temp3],
          lines: res.data.lines,
          with_driver: res.data.with_driver,
          note: res.data.note
        })
      }).catch(err => {
        console.log('application-filled.vue mounted fetchApplicationDetail failure', err)
      })
    }
  },
  methods: {
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag() {
      const view = this.$route
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
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
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    },
    onSubmit() {
      console.log('application-filled.vue methods onSubmit', this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form, {
            applicant_id: this.form.applicant.value,
            applicant_name: this.form.applicant.label,
            member: this.form.member.map(item => item.value).join(','),
            member_name: this.form.member.map(item => item.label).join(','),
            time_start: this.form.duration[0],
            time_end: this.form.duration[1]
          })
          if (this.$route.query.action === 'edit') {
            resubmit(tempData).then(res => {
              console.log('application-filled.vue methods onSubmit resubmit success', res)
              Message({
                message: res.message,
                type: 'success',
                duration: 5 * 1000
              })
              this.closeSelectedTag()
              // this.$router.push({ path: '/transport-mg/application' })
              // this.refreshView()
            }).catch(err => {
              console.log('application-filled.vue methods onSubmit resubmit failure', err)
            })
          } else {
            addApplication(tempData).then(res => {
              console.log('application-filled.vue methods onSubmit addApplication success', res)
              Message({
                message: res.message,
                type: 'success',
                duration: 5 * 1000
              })
              this.closeSelectedTag()
              // this.$router.push({ path: '/transport-mg/application' })
              // this.refreshView()
            }).catch(err => {
              console.log('application-filled.vue methods onSubmit addApplication failure', err)
            })
          }
          return true
        } else {
          return false
        }
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

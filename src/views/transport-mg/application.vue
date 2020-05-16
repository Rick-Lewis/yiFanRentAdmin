<template>
  <div class="application-container">
    <div class="header">
      <el-form ref="form" :model="conditionForm" label-width="85px" label-suffix="：">
        <el-form-item label="审批状态">
          <el-radio-group v-model="conditionForm.status" size="small">
            <el-radio v-for="(item, index) in conditionForm.statusList" :key="index" :label="item.label" border>{{ item.value }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="other-container">
          <el-form-item label="用车事由">
            <el-input v-model="conditionForm.reason" placeholder="请输入关键字搜索" />
          </el-form-item>
          <el-form-item label="随车人员">
            <el-input v-model="conditionForm.staff" placeholder="请输入随车人员名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="margin-top: 10px;"><el-button type="primary" @click="onSubmit">+用车申请</el-button></div>
    <div class="content">
      <div class="card-container">
        <div class="card-header">审批编号：Z2003151420140001</div>
        <div class="card-content">
          <div class="col-container">
            <div>
              <div style="font-size: 20px;">2020年第一次招商会议用车</div>
              <div>林东东 于 2020-03-15 14:20:14 申请</div>
            </div>
            <div>
              <div>往：古丈县县政府大楼-吉首市高铁站</div>
              <div style="margin-top: 5px;">返：吉首市高铁站-古丈县宾馆</div>
            </div>
            <div>备注：此次接待投资商共5人，乘车人员共8人</div>
          </div>
          <el-divider direction="vertical" />
          <div>
            <div>
              <span>随车人员：</span>
              <el-tag size="small">标签一</el-tag>
              <el-tag size="small">标签一</el-tag>
              <el-tag size="small">标签一</el-tag>
              <el-tag size="small">标签一</el-tag>
              <el-tag size="small">标签一</el-tag>
            </div>
            <div style="margin-top: 16px;">司机：梁山伯</div>
          </div>
          <el-divider direction="vertical" />
          <div>待审批</div>
          <el-divider direction="vertical" />
          <div style="padding-right: 100px;">
            <div><el-link type="primary">撤销</el-link></div>
            <div style="margin-top: 16px;" @click="handleProcessClick"><el-link type="primary">进度</el-link></div>
          </div>
        </div>
        <div class="card-footer">
          <el-collapse v-model="activeNames" :accordion="true" @change="handleClapChange">
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
    </div>
  </div>
</template>
<script>
export default {
  name: 'Application',
  components: {},
  data: function() {
    return {
      activeNames: [],
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
        status: '0',
        reason: '',
        staff: ''
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      console.log('application.vue methods onSubmit')
    },
    handleProcessClick() {
      if (this.activeNames.length > 0) {
        this.activeNames = []
      } else {
        this.activeNames = ['1']
      }
    },
    handleClapChange(val) {
      console.log('application.vue handleClapChange', val)
    }
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
    background-color: #ffffff;
    padding-top: 16px;
    margin-top: 10px;
    .card-container{
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
        }
      }
    }
  }
}
</style>
